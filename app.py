from flask import Flask, jsonify, request
import cv2
from pyzbar import pyzbar
import requests

app = Flask(__name__)

def lookup_product(barcode_data):
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode_data}.json"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        product = data.get("product", {})
        return {
            "name": product.get("product_name", "Ukjent produkt"),
            "expiration_date": product.get("expiration_date", "Ingen dato funnet"),
        }
    return {"error": "Not found"}

@app.route("/scan-py", methods=["GET"])
def scan_barcode():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return jsonify({"error": "Cant open camera"})

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        barcodes = pyzbar.decode(gray)

        if barcodes:
            barcode_data = barcodes[0].data.decode("utf-8")
            cap.release()
            cv2.destroyAllWindows()
            return jsonify(lookup_product(barcode_data))

@app.route("/lookup/<barcode>")
def lookup(barcode):
    return jsonify(lookup_product(barcode))

if __name__ == "__main__":
    app.run(debug=True)
