import React, { useMemo, useState } from 'react'
import { MODEL, predictPrice } from './model.js'

const inr = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)

function todayStamp() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function App() {
  const [region, setRegion] = useState('Amsterdam')
  const [roomType, setRoomType] = useState('Double')
  const [rating, setRating] = useState(8.2)
  const [reviewsCount, setReviewsCount] = useState(400)
  const [hasView, setHasView] = useState(false)
  const [hasBalcony, setHasBalcony] = useState(false)
  const [isDeluxe, setIsDeluxe] = useState(false)
  const [ticketNo] = useState(() => Math.floor(100000 + Math.random() * 899999))

  const mape = MODEL.metrics.mape

  // Recomputes automatically whenever any dependency below changes —
  // no button needed. predictPrice() is pure math (a dot-product against
  // the trained coefficients), so this is effectively instant.
  const ticket = useMemo(
    () =>
      predictPrice({
        region,
        roomType,
        rating: Number(rating),
        reviewsCount: Number(reviewsCount),
        hasView,
        hasBalcony,
        isDeluxe,
      }),
    [region, roomType, rating, reviewsCount, hasView, hasBalcony, isDeluxe]
  )

  const bandLow = Math.round(ticket * (1 - mape))
  const bandHigh = Math.round(ticket * (1 + mape))

  return (
    <div className="page">
      <header className="masthead">
        <div className="masthead-mark">NL</div>
        <div className="masthead-text">
          <h1>Kameroffer</h1>
          <p>a nightly-rate estimator, ledgered from 525 Netherlands listings</p>
        </div>
      </header>

      <main className="desk">
        <div className="ledger">
          <div className="ledger-row ledger-head">
            <span>Booking particulars</span>
            <span className="dotted-fill" aria-hidden="true" />
            <span>No. {ticketNo}</span>
          </div>

          <label className="field">
            <span className="field-label">City / region</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {MODEL.regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Room type</span>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              {MODEL.roomTypes.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">
              Guest rating <em>{Number(rating).toFixed(1)} / 10</em>
            </span>
            <input
              type="range"
              min={MODEL.ratingRange[0]}
              max={MODEL.ratingRange[1]}
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Review count</span>
            <input
              type="number"
              min="0"
              max="10000"
              value={reviewsCount}
              onChange={(e) => setReviewsCount(e.target.value)}
            />
          </label>

          <div className="field checks">
            <span className="field-label">Room notes</span>
            <div className="check-grid">
              <label className="check">
                <input type="checkbox" checked={hasView} onChange={(e) => setHasView(e.target.checked)} />
                Has a view
              </label>
              <label className="check">
                <input type="checkbox" checked={hasBalcony} onChange={(e) => setHasBalcony(e.target.checked)} />
                Has a balcony
              </label>
              <label className="check">
                <input type="checkbox" checked={isDeluxe} onChange={(e) => setIsDeluxe(e.target.checked)} />
                Deluxe / superior / premium
              </label>
            </div>
          </div>
        </div>

        <div className="stub stub-active">
          <div className="stub-perf" aria-hidden="true" />
          <div className="stub-inner">
            <div className="stub-row">
              <span>Kameroffer estimate</span>
              <span>{todayStamp()}</span>
            </div>

            <div className="stub-price">
              <span className="stub-currency">₹</span>
              <span className="stub-amount">{inr(ticket)}</span>
              <span className="stub-unit">/ night</span>
            </div>
            <div className="stub-range">
              likely between ₹{inr(bandLow)} and ₹{inr(bandHigh)}
            </div>
            <div className="stub-divider" />
            <dl className="stub-details">
              <div><dt>Region</dt><dd>{region}</dd></div>
              <div><dt>Room</dt><dd>{roomType}</dd></div>
              <div><dt>Rating</dt><dd>{Number(rating).toFixed(1)}</dd></div>
              <div><dt>Reviews</dt><dd>{reviewsCount}</dd></div>
            </dl>
          </div>
        </div>
      </main>

      <footer className="colophon">
        <p>
          Trained with ridge regression on a 525-listing Netherlands hotel dataset.
          Held-out accuracy: R² {MODEL.metrics.r2.toFixed(2)}, mean error ≈ ±{Math.round(MODEL.metrics.mape * 100)}%.
          Treat this as a rough estimate, not a live quote — prices, taxes and dates aren't modelled.
        </p>
        <p className="colophon-sub">All inference runs in your browser. No data leaves this page.</p>
      </footer>
    </div>
  )
}
