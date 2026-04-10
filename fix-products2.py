content = open('/var/www/danditos.nex.monster/app/admin/products/page.tsx').read()

old_block = """                required
              />
            </div>
            <div className="form-group">
              <label>Active</label>"""

new_block = """                required
              />
            </div>
            <div className="form-group">
              <label>Weight (g)</label>
              <input
                type="number"
                value={form.weight_grams}
                onChange={(e) => setForm({...form, weight_grams: e.target.value})}
                placeholder="300"
              />
            </div>
            <div className="form-group">
              <label>Active</label>"""

content = content.replace(old_block, new_block)
open('/var/www/danditos.nex.monster/app/admin/products/page.tsx', 'w').write(content)
print('Done')
