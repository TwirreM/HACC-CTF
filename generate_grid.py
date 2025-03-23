import qrcode
from fpdf import FPDF

# The provided grid text
grid = [
    ">>>v>>>>^^",
    "^^<v>>v>>^",
    "^>>>>^v<v^",
    ">>>^^^v^>^",
    "^<<<<<x>>v",
    "^v^vvvv^><"
]

# Mapping symbols to text
symbol_map = {
    ">": "right",
    "<": "left",
    "^": "up",
    "v": "down",
    "x": "ctf_12969142"
}

# Initialize a PDF
pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page(orientation='L')

# Set font for text
pdf.set_font("Arial", size=12)
pdf.set_x(10)
pdf.set_y(20)

for row in grid:
    for symbol in row:
        # Get the corresponding text for the symbol
        text = symbol_map[symbol]
        print(text)
        
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
        qr_image_path = "./qr-codes/" + text + ".png"
        qr_image.save(qr_image_path)

        # Add the image to the PDF
        pdf.image(qr_image_path, x=pdf.get_x(), y=pdf.get_y(), w=28, h=28)
        pdf.set_x(pdf.get_x() + 28)
    pdf.set_y(pdf.get_y() + 28)
    pdf.set_x(10)

# Save the PDF
output_pdf_path = "grid_qr_codes.pdf"
pdf.output(output_pdf_path)