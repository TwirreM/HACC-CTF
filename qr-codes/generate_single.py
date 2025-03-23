import qrcode
from fpdf import FPDF

text = "ctf_29879640"

# Initialize a PDF
pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# Set font for text
pdf.set_font("Arial", size=12)
pdf.set_x(50)
pdf.set_y(50)

# Create a QR code
qr = qrcode.QRCode(
    version=1,  # Size of QR code
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,  # Pixel size of each box
    border=2,  # Border thickness
)
qr.add_data(text)
qr.make(fit=True)

# Create an image from the QR code
qr_image = qr.make_image(fill="black", back_color="white")

# Save the image to a temporary file
qr_image_path = "./" + text + ".png"
qr_image.save(qr_image_path)

# Add the image to the PDF
pdf.image(qr_image_path, x=30, y=50, w=150, h=150)

# Save the PDF
output_pdf_path = text + ".pdf"
pdf.output(output_pdf_path)