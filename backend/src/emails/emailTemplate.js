export function createWelcomeEmailTemplate(name, profileUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to DevLoop</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(to right, #0f2027, #203a43, #2c5364); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 30px;">Welcome to DevLoop 🚀</h1>
      <p style="color: #d1e9ff; margin-top: 10px; font-size: 16px;">
        Build. Collaborate. Ship.
      </p>
    </div>

    <!-- Body -->
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <p style="font-size: 18px; color: #2c5364;"><strong>Hey ${name},</strong></p>

      <p>
        Welcome to <strong>DevLoop</strong> — a developer-first professional networking platform built for
        engineers who love shipping real projects and collaborating with like-minded builders.
      </p>

      <p>
        Unlike traditional networks, DevLoop is focused on <strong>code, projects, and collaboration</strong>.
        Whether you're building with the MERN stack, exploring new technologies, or teaming up for your next big idea —
        you’re in the right place.
      </p>

      <!-- Getting Started -->
      <div style="background-color: #f4f7f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Get started in minutes:</strong></p>
        <ul style="padding-left: 20px; margin: 0;">
          <li>Showcase your projects and tech stack</li>
          <li>Connect with developers and collaborators</li>
          <li>Chat in real-time and discuss ideas</li>
          <li>Discover and join exciting projects</li>
        </ul>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" 
           style="background-color: #2c5364; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
          Complete Your DevLoop Profile
        </a>
      </div>

      <p>
        If you ever get stuck or have feedback, we’d love to hear from you.
        DevLoop is built by developers, for developers.
      </p>

      <p style="margin-top: 30px;">
        Happy building,<br>
        <strong>The DevLoop Team</strong>
      </p>
    </div>

  </body>
  </html>
  `;
}
