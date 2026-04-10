content = open('/var/www/danditos.nex.monster/app/admin/settings/page.tsx').read()

# Add shipping_origin_postal to interface
content = content.replace(
    '  shipping_markup_percent: string\n  email_from:',
    '  shipping_markup_percent: string\n  shipping_origin_postal: string\n  email_from:'
)

# Add to initial state
content = content.replace(
    "    shipping_markup_percent: '0',\n    email_from:",
    "    shipping_markup_percent: '0',\n    shipping_origin_postal: 'T5B0A3',\n    email_from:"
)

# Add form field after shipping_markup_percent
old_field = """            <div className="form-group">
              <label>Email From Address</label>"""

new_field = """            <div className="form-group">
              <label>Shipping Origin Postal Code</label>
              <input
                type="text"
                value={settings.shipping_origin_postal}
                onChange={(e) => handleChange('shipping_origin_postal', e.target.value)}
                onBlur={(e) => handleSave('shipping_origin_postal', e.target.value)}
                placeholder="T5B0A3"
              />
            </div>

            <div className="form-group">
              <label>Email From Address</label>"""

content = content.replace(old_field, new_field)

# Also add default value for the new setting in the db
open('/var/www/danditos.nex.monster/app/admin/settings/page.tsx', 'w').write(content)
print('Done')
