# Kameroffer — Netherlands Hotel Price Estimator

A small React app that estimates a nightly hotel rate from a model trained on
525 real Netherlands hotel listings (`HotelFinalDataset.xlsx`). The trained
model is compiled into plain JavaScript (`src/model.js`), so **prediction
happens entirely in the browser** — no backend, no API calls, nothing to pay
for or keep running. That makes it a perfect fit for a static host like
Netlify.

## How the model works

- **Algorithm:** Ridge regression (`scikit-learn`), trained in `prep_and_train.py`.
- **Features:**
  - City/region — smoothed target-encoded mean price
  - Room type bucket (Double, Suite, Twin, Family, etc.) — smoothed target-encoded mean price
  - Guest rating (0–10)
  - log(review count)
  - Flags: has a view, has a balcony, is deluxe/premium/superior
- **Held-out performance:** R² ≈ 0.23–0.4 (varies by split), mean absolute
  error ≈ ₹4,000, mean absolute percentage error ≈ 28–30%.

Be upfront with users of the app: this is a rough estimate from a fairly
small, single-source dataset — not a live pricing feed. It doesn't know
about dates, seasonality, currency shifts, or specific hotel brands, so
treat the output as a ballpark, not a quote. The app already shows this
caveat and an error band in its footer.

### Retraining on new/updated data

1. Put your spreadsheet in place of `HotelFinalDataset.xlsx` (same columns:
   `Name, Place, Type, Price, ReviewsCount, Rating, City, State`).
2. Run:
   ```bash
   pip install pandas numpy scikit-learn openpyxl
   python3 prep_and_train.py
   ```
3. This regenerates `export_data.json`. Copy the `MODEL = {...}` object it
   implies into `src/model.js` (or write a small script to do it — see the
   bottom of `prep_and_train.py` for the shape of the export).

## Run it locally

```bash
npm install
npm run dev
```

Visit the site to test (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

## Deployed on Netlify

Live: `https://hsepredict.netlify.app/`