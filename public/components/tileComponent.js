const tileTemplate = document.createElement('template');
tileTemplate.innerHTML = `
  <style>
  
  .tile__img {
    width: 250px;
    height: 140.625px;
    -o-object-fit: cover;
       object-fit: cover;
  }

  .tile__details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    font-size: 10px;
    opacity: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
    transition: 450ms opacity;
  }

  .tile__details:after,
  .tile__details:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: #000;
  }

  .tile__details:after {
    margin-top: -25px;
    margin-left: -25px;
    width: 50px;
    height: 50px;
    border: 3px solid #ecf0f1;
    line-height: 50px;
    text-align: center;
    border-radius: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1;
  }

  .tile__details:before {
    content: '▶';
    left: 0;
    width: 100%;
    font-size: 30px;
    margin-left: 7px;
    margin-top: -18px;
    text-align: center;
    z-index: 2;
  }

  .tile:hover .tile__details {
    opacity: 1;
  }

  .tile__title {
    position: absolute;
    bottom: 0;
    padding: 10px;
  }
  
  </style>

    <div class="tile">
        <div class="tile__media">
            <img class="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-3.jpg" alt=""  />
        </div>
        <div class="tile__details">
            <div class="tile__title">
                Top Gear
            </div>
        </div>
    </div>
  `;

class TileComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this
            .shadowRoot
            .appendChild(tileTemplate.content.cloneNode(true));
    }
    connectedCallback() {}

    setValue(value) {
        this.shadowRoot.querySelector('.tile__title').innerHTML = value.name;
        this.shadowRoot.querySelector('.tile__img').src = value.thumbnailLink;
    }

    disconnectedCallback() {}
}

window
    .customElements
    .define('tile-component', TileComponent);