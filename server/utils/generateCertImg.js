const fs = require('fs').promises;
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

// Register fonts (assuming this is done at the top of your file)
const PacificoFontPath = path.join(__dirname, "fonts", "Pacifico-Regular.ttf");
const DroidSerifRegFontPath = path.join(__dirname, "fonts", "DroidSerif-Regular.ttf");
registerFont(PacificoFontPath, { family: "Pacifico" });
registerFont(DroidSerifRegFontPath, { family: "Droid Serif Reg" });

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

async function generateCertificateImage(courseTitle, studentName, description, signatureUrl) {
    const canvas = createCanvas(1414, 2000);
    const ctx = canvas.getContext("2d");

    // Load background image
    const templatePath = path.join(__dirname, "certificate", "cet-template.png");
    const background = await loadImage(templatePath);
    ctx.drawImage(background, 0, 0, 1414, 2000);

    // Set padding
    const paddingX = 100;
    const paddingY = 100;

    // Course Title
    ctx.font = "60px 'Droid Serif Reg', serif";
    ctx.fillStyle = "#1A237E";
    ctx.textAlign = "center";
    ctx.fillText(`${courseTitle}`, canvas.width / 2, paddingY + 100);

    // Student Name
    ctx.font = "regular 48px 'Pacifico', serif";
    ctx.fillStyle = "#4A148C";
    ctx.fillText(`${studentName}`, canvas.width / 2, paddingY + 300);

    // Description (multiline)
    ctx.font = "24px 'Droid Serif Reg', serif";
    ctx.fillStyle = "#1B5E20";
    ctx.textAlign = "left";
    wrapText(
        ctx,
        description,
        paddingX,
        paddingY + 500,
        canvas.width - 2 * paddingX,
        30
    );

    // Completion Date
    ctx.font = "36px 'Droid Serif Reg', serif";
    ctx.fillStyle = "#1B5E20";
    ctx.textAlign = "center";
    ctx.fillText(
        `Completed on ${new Date().toLocaleDateString()}`,
        canvas.width / 2,
        canvas.height - paddingY - 200
    );

    // Load and draw signature
    if (signatureUrl) {
        try {
            const signature = await loadImage(signatureUrl);
            const signatureWidth = 300;
            const signatureHeight = 150;
            const signatureX = (canvas.width - signatureWidth) / 2;
            const signatureY = canvas.height - paddingY - 150;
            ctx.drawImage(
                signature,
                signatureX,
                signatureY,
                signatureWidth,
                signatureHeight
            );
        } catch (error) {
            console.error("Error loading signature:", error);
        }
    }

    const imageBuffer = canvas.toBuffer("image/png");

    // Create a folder for storing certificates if it doesn't exist
    const certificateFolder = path.join(__dirname, 'generated_certificates');
    await fs.mkdir(certificateFolder, { recursive: true });

    // Generate a unique filename using timestamp and student name
    const timestamp = Date.now();
    const sanitizedStudentName = studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${timestamp}_${sanitizedStudentName}.png`;

    // Save the image
    const filePath = path.join(certificateFolder, filename);
    await fs.writeFile(filePath, imageBuffer);

    console.log(`Certificate saved: ${filePath}`);

    return { imageBuffer, filePath };
}

// Example usage
const courseTitle = "Advanced MERN Stack";
const studentName = "John Doe";
const description = "This certificate is awarded to Mr. John Doe for successfully completing the course on Advanced MERN Stack. The course covered various topics such as MERN stack, state management, and building real-world applications.";
const signatureUrl = "https://www.signwell.com/assets/vip-signatures/bruce-lee-signature-40abf707b68d9bff51d53cfe915a429115247816f034e172a752b8f4ebc65b9f.svg";

generateCertificateImage(courseTitle, studentName, description, signatureUrl)
    .then(({ imageBuffer, filePath }) => {
        console.log(`Certificate generated and saved to: ${filePath}`);
        // You can use the imageBuffer for further processing if needed
    })
    .catch(error => {
        console.error('Error generating certificate:', error);
    });