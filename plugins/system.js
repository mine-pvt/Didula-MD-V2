const config = require('../config');
let fs = require('fs');
const { exec } = require('child_process');
const { cmd } = require('../command');


conn.ev.on("call", async (json) => {
 if(config.ANTI_CALL === 'true') {
  for (let id of json) {
    if (id.status === "offer") {
      let msg = await conn.sendMessage(id.from, {
        text: "ᴄᴀʟʟ ᴅᴇᴄʟɪɴᴇᴅ ʙʏ ᴅɪᴅᴜʟᴀ ᴍᴅ ᴠ2",
      });

      
      await conn.rejectCall(id.id, id.from); // Block the user

      await conn.updateBlockStatus(id.from, "block");
    }
  }
});






cmd({
    pattern: "update",
    react: "🔄",
    desc: "Update folder from GitHub",
    category: "system",
    use: '.update',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const repoUrl = 'https://github.com/itsme-didulabot/Didula-MD-V2.git'; // لینک مخزن گیت‌هاب
        const targetFolder = 'plugins'; // پوشه‌ای که باید به‌روز شود

        // بررسی وجود پوشه هدف
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder); // ساخت پوشه در صورت عدم وجود
        }

        // تعیین دستور مناسب گیت
        const gitCommand = fs.existsSync(`${targetFolder}/.git`)
            ? `git -C ${targetFolder} pull`
            : `git clone ${repoUrl} ${targetFolder}`;

        // اجرای دستور گیت
        await new Promise((resolve, reject) => {
            exec(gitCommand, (err, stdout, stderr) => {
                if (err) {
                    reject(`Git command failed: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });
        });

        // ارسال پیام موفقیت
        await conn.sendMessage(from, { text: '*✅ Update completed successfully!*' }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply(`*Error during update:* ${error.message}`);
    }
});