# Workflow: Update / Extend Existing Theme Build

**Workflow ID:** `workflow-update-existing`
**Purpose:** Improve, extend, or update an existing theme build (e.g., add new template, improve responsiveness, add WooCommerce)
**Entry assumption:** Project directory and MANIFEST.md already exist

---

## Entry Point

User provides:
- Path to existing theme build
- What needs to change/extend
- Goal of the update

---

## Pipeline

### Phase 1: Discovery
**Agents:** `orchestrator`

Read existing MANIFEST.md and identify affected agents.

### Phase 2: Targeted Rebuild
Route to the specific agents needed for the update (not full pipeline).

Examples:
- Add new homepage section → `homepage-landing` + `frontend-engineering`
- Improve mobile responsiveness → `responsiveness-accessibility`
- Add WooCommerce → `woocommerce-experience` + `woocommerce-template-integration` + `qa-compatibility`
- Performance pass → `performance-optimization`

### Phase 3: Targeted QA
**Agents:** `qa-compatibility` (focused on changed areas)

### Phase 4: Re-package
**Agents:** `packaging-delivery`

---

## Special Note

If the update significantly changes the theme concept or design direction, the orchestrator should recommend running the full build workflow instead.
