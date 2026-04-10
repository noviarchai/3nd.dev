content = open('/var/www/danditos.nex.monster/app/admin/settings/page.tsx').read()

# Insert origin postal code field before the Email Configuration section
old_block = """      </div>

      <div className="checkout-form">
        <h3>Email Configuration</h3>"""

new_block = """      </div>

      <div className="checkout-form">
        <h3>Shipping Configuration</h3>

        <div className="form-group">
          <label>Your Postal Code (Origin for Shipping Rates)</label>
          <input
            type="text"
            value={settings.shipping_origin_postal}
            onChange={(e) => handleChange('shipping_origin_postal', e.target.value)}
            onBlur={(e) => handleSave('shipping_origin_postal', e.target.value)}
            placeholder="T5B0A3"
          />
          <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>
            Used to calculate shipping rates from your location
          </small>
        </div>
      </div>

      <div className="checkout-form">
        <h3>Email Configuration</h3>"""

content = content.replace(old_block, new_block)
open('/var/www/danditos.nex.monster/app/admin/settings/page.tsx', 'w').write(content)
print('Done')
