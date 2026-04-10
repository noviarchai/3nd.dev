content = open('/var/www/danditos.nex.monster/app/admin/products/page.tsx').read()

# 1. Add weight_grams to Product interface
content = content.replace(
    '  is_active: boolean\n}',
    '  is_active: boolean\n  weight_grams?: number\n}'
)

# 2. Add weight_grams to form state
content = content.replace(
    "    image_url: '',\n    is_active: true\n  })",
    "    image_url: '',\n    is_active: true,\n    weight_grams: ''\n  })"
)

# 3. Add weight_grams to handleEdit
content = content.replace(
    "      image_url: product.image_url,\n      is_active: product.is_active\n    }",
    "      image_url: product.image_url,\n      is_active: product.is_active,\n      weight_grams: product.weight_grams || 300\n    }"
)

# 4. Add weight_grams field in the form JSX (after the stock field)
content = content.replace(
    "              value={form.stock}\n              />\n\n              <div className=\"form-group\">\n                <label>Active</label>",
    "              value={form.stock}\n              />\n\n            <div className=\"form-group\">\n              <label>Weight (grams per bottle)</label>\n              <input\n                type=\"number\"\n                value={form.weight_grams}\n                onChange={(e) => setForm({...form, weight_grams: e.target.value})}\n                placeholder=\"300\"\n              />\n            </div>\n\n              <div className=\"form-group\">\n                <label>Active</label>"
)

open('/var/www/danditos.nex.monster/app/admin/products/page.tsx', 'w').write(content)
print('Done')
