# Workflow: WooCommerce-Focused Build

**Workflow ID:** `workflow-woocommerce-only`
**Purpose:** For projects where WooCommerce template development is the primary focus (e.g., redesigning an existing theme's shop experience)
**Entry assumption:** Theme concept, strategy, and base structure already exist

---

## Entry Point

User has an existing theme build and wants to add/redo WooCommerce integration specifically.

Required inputs already present:
- Theme Concept Document
- WooCommerce Experience Blueprint (or need to create it)
- Theme build directory with basic template files

---

## Pipeline

### Phase 1: WooCommerce Strategy
**Agents:** `woocommerce-experience`

### Phase 2: WooCommerce Template Integration
**Agents:** `woocommerce-template-integration`

### Phase 3: WooCommerce QA
**Agents:** `qa-compatibility` (focused on WooCommerce flows)

### Phase 4: Packaging Update
**Agents:** `packaging-delivery` (update .zip with new WooCommerce templates)
