// Dynamic Form Handler for Admin Panel
class DynamicFormHandler {
    constructor() {
        this.typeSelect = document.getElementById('add-page-type-select');
        this.typeSpecificFields = document.getElementById('type-specific-fields');
        this.typeFieldsContainer = document.getElementById('type-fields-container');
        
        this.pageTypeConfigs = {
            '3x2': {
                fields: [
                    { name: 'xlsx_file', type: 'text', label: 'xlsx_file', value: 'producao.xlsx', required: true }
                ]
            },
            '2x2': {
                fields: [
                    { name: 'xlsx_file', type: 'text', label: 'xlsx_file', value: 'producao.xlsx', required: true }
                ]
            },
            'text-md': {
                fields: [
                    { name: 'md_file', type: 'text', label: 'markdown_file', value: 'sample.md', required: true },
                    { name: 'font_size', type: 'number', label: 'font_size', value: '16', required: false }
                ]
            },
            'image': {
                fields: [
                    { name: 'image_file', type: 'text', label: 'image_file', value: 'sample.jpg', required: true }
                ]
            },
            '2x1-graph': {
                fields: [
                    { name: 'xlsx_file', type: 'text', label: 'xlsx_file', value: 'producao.xlsx', required: true }
                ]
            },
            '2x2-cards': {
                fields: [
                    { name: 'xlsx_file', type: 'text', label: 'xlsx_file', value: 'producao.xlsx', required: true }
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        if (this.typeSelect) {
            this.populateTypeOptions();
            this.typeSelect.addEventListener('change', () => this.handleTypeChange());
        }
    }
    
    populateTypeOptions() {
        this.typeSelect.innerHTML = '';
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select Type --';
        this.typeSelect.appendChild(emptyOption);
        
        // Add type options
        Object.keys(this.pageTypeConfigs).forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            this.typeSelect.appendChild(option);
        });
    }
    
    handleTypeChange() {
        const selectedType = this.typeSelect.value;
        
        if (selectedType && this.pageTypeConfigs[selectedType]) {
            this.showTypeSpecificFields(selectedType);
        } else {
            this.hideTypeSpecificFields();
        }
    }
    
    showTypeSpecificFields(type) {
        const config = this.pageTypeConfigs[type];
        this.typeFieldsContainer.innerHTML = '';
        
        config.fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = `form-field ${field.required ? 'required' : ''}`;
            
            const label = document.createElement('label');
            label.textContent = window.t ? window.t(field.label) : field.label;
            
            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.value = field.value;
            input.required = field.required;
            
            fieldDiv.appendChild(label);
            fieldDiv.appendChild(input);
            this.typeFieldsContainer.appendChild(fieldDiv);
        });
        
        this.typeSpecificFields.style.display = 'block';
    }
    
    hideTypeSpecificFields() {
        this.typeSpecificFields.style.display = 'none';
        this.typeFieldsContainer.innerHTML = '';
    }
    
    getFormData() {
        const form = document.getElementById('add-page-form');
        const formData = new FormData(form);
        
        // Get type-specific fields
        const selectedType = this.typeSelect.value;
        if (selectedType && this.pageTypeConfigs[selectedType]) {
            const config = this.pageTypeConfigs[selectedType];
            config.fields.forEach(field => {
                const input = this.typeFieldsContainer.querySelector(`input[name="${field.name}"]`);
                if (input) {
                    formData.set(field.name, input.value);
                }
            });
        }
        
        return formData;
    }
    
    validateForm() {
        const selectedType = this.typeSelect.value;
        if (!selectedType) {
            alert('Please select a page type');
            return false;
        }
        
        // Check required fields
        const form = document.getElementById('add-page-form');
        const requiredInputs = form.querySelectorAll('input[required]');
        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                alert(`Please fill in the required field: ${input.name}`);
                input.focus();
                return false;
            }
        }
        
        // Check type-specific required fields
        if (selectedType && this.pageTypeConfigs[selectedType]) {
            const config = this.pageTypeConfigs[selectedType];
            config.fields.forEach(field => {
                if (field.required) {
                    const input = this.typeFieldsContainer.querySelector(`input[name="${field.name}"]`);
                    if (input && !input.value.trim()) {
                        alert(`Please fill in the required field: ${field.label}`);
                        input.focus();
                        return false;
                    }
                }
            });
        }
        
        return true;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dynamicFormHandler = new DynamicFormHandler();
}); 