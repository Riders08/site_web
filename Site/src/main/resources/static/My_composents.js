class Space_Empty extends HTMLElement {
    connectedCallback(){
        const n = parseInt(this.getAttribute("number") ) || 1;
        this.innerHTML = "&nbsp;".repeat(n);
    }
}

customElements.define("my-space", Space_Empty);