const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { Webhook } = require("svix");
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Clerk webhook to sync users to Supabase
router.post("/clerk", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    // If webhook secret is set, verify the signature
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    let evt;

    if (WEBHOOK_SECRET) {
      const svixHeaders = {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      };

      const wh = new Webhook(WEBHOOK_SECRET);
      evt = wh.verify(JSON.stringify(req.body), svixHeaders);
    } else {
      // No webhook secret set — trust the payload (dev mode)
      evt = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses } = evt.data;
      const primaryEmail =
        email_addresses && email_addresses.length > 0
          ? email_addresses[0].email_address
          : null;

      if (primaryEmail) {
        const { error } = await supabase.from("users").upsert(
          {
            clerk_id: id,
            email: primaryEmail,
          },
          { onConflict: "clerk_id" }
        );

        if (error) {
          console.error("Supabase insert error:", error);
          return res.status(500).json({ error: "Failed to save user" });
        }

        console.log(`User synced: ${primaryEmail} (${id})`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(400).json({ error: "Webhook verification failed" });
  }
});

module.exports = router;
