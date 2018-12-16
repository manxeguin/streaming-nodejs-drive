const tileRowTemplate = document.createElement('template');
tileRowTemplate.innerHTML = `
  <style>

  .row {
    overflow: hidden;
    width: 100%;
    text-align: center;
  }

  .row__inner {
    transition: 450ms -webkit-transform;
    transition: 450ms transform;
    transition: 450ms transform, 450ms -webkit-transform;
    font-size: 0;
    white-space: nowrap;
    margin: 70.3125px 0;
    padding-bottom: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .row__inner-video {
    margin: 25px 0;
    padding-bottom: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  tile-component {
    position: relative;
    display: inline-block;
    width: 250px;
    height: 140.625px;
    margin-right: 10px;
    font-size: 20px;
    cursor: pointer;
    transition: 450ms all;
    -webkit-transform-origin: center left;
            transform-origin: center left;
  }

  tile-component:hover .tile__details {
    opacity: 1;
  }

  :host tile-component {
    opacity: 0.3;
  }

  :host tile-component:hover {
    -webkit-transform: scale(1.5);
            transform: scale(1.5);
    opacity: 1;
  }

  tile-component:hover ~ tile-component {
    -webkit-transform: translate3d(125px, 0, 0);
            transform: translate3d(125px, 0, 0);
  }
  </style>

  <div class="row">
    <div class="row__inner-video">
        <video id="video-player" width="640" height="480" controls style="display:none">
        </video>
    </div>
  </div>
  <div class="row">
    <div id="tiles" class="row__inner">
    </div>
  </div>
  `;

class TileRowComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this
            .shadowRoot
            .appendChild(tileRowTemplate.content.cloneNode(true));
    }
    buildTile(videoElement) {
        const tile = document.createElement('tile-component');
        tile.setValue(videoElement);
        tile.addEventListener('click', (event) => {
            this.player.style.display = 'block';
            this.player.src = `/video/${videoElement.id}`;
            this.player.play();
        });

        return tile;
    }
    connectedCallback() {
        const videoRow = this
            .shadowRoot
            .getElementById('tiles');
        this.player = this
            .shadowRoot
            .getElementById('video-player');

        fetch('/list')
            .then(response => response.json())
            .then(response => {
                response.forEach(element => {
                    videoRow.appendChild(this.buildTile(element));
                });
            });
    }

    disconnectedCallback() {}
}

window
    .customElements
    .define('tile-row-component', TileRowComponent);