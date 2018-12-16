var canvas,
    context,
    headline = '',
    newsline = '',
    img,
    time;

$(document).ready(function() {
    let headlineInput = $('#headline-input');
    let newslineInput = $('#newsline-input');
    let imgInput = $('#img-input');
    let downloadBtn = $('#btn-download');
    let imgurBtn = $('#btn-imgur');

    canvas = $('#canvas').get(0);
    context = canvas.getContext('2d');

    img = $('#img')[0];
    img.onload = update;

    headlineInput.on('input', update);
    headlineInput.val('');

    newslineInput.on('input', update);
    newslineInput.val('');

    imgInput.on('change', update);
    imgInput.val('');

    downloadBtn.click(function() {
        canvas.toBlob(function(blob) {
            saveAs(blob, 'breakingnews.png');
        });
    });

    imgurBtn.click(function() {
        let img = canvas.toDataURL().split(',')[1];
        let alert_box = $('#imgur-link');
        $.ajax({
            url: 'https://api.imgur.com/3/image',
            type: 'POST',
            headers: {
                Authorization: 'Client-ID d305f59fe14c9ca',
                Accept: 'application/json'
            },
            data: {
                type: 'base64',
                name: 'breakingnews.png',
                title: 'Breaking News!',
                image: img
            },
            success: function(result) {
                let url = 'https://i.imgur.com/' + result.data.id + '.jpg';
                let deleteurl = 'https://imgur.com/delete/' + result.data.deletehash;
                let html = `Success! You can find your image <a href="${url}" class="alert-link">here</a>!
                            <p>Would you like to make a cross-reference?</p>
                            <input id="crossref-url" type="text" placeholder="Desired URL, f.ex. JJBACosplay">
                            <input id="btn-submit-crossref" type="submit" value="Submit!">`;
                alert_box.html(html);
                $('#btn-submit-crossref').click(() => {
                    let url_from = $('#crossref-url').val();
                    if (!url_from.match(/^[a-zA-Z]+$/)) {
                        alert('The link must consist only of english letters!');
                    } else {
                        $.ajax({
                            type: 'POST',
                            url: '/makeCrossRef',
                            data: {
                                url_from: url_from,
                                url_to: url
                            },
                            success: res => {
                                alert_box.html(`Success! You can find your image by the link '<a href="https://memema.azurewebsites.net/${res.link}">https://memema.azurewebsites.net/${res.link}</a>'`);
                            },
                            error: res => {
                                alert('Unable to make a cross-reference link! The URL is probably taken');
                                alert_box.html(html);
                            }
                        });
                        alert_box.html('Uploading...');
                    }
                });
            }, error: function(err) {
                alert_box.html('Error uploading to Imgur :(');
            }
        });
        alert_box.css('opacity', '1');
        alert_box.html('Processing request...');
    });
    $(window).on('load', () => {
        update();
    });
});

function update(event) {
    let date = new Date();
    time = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    if (event) {
        switch (event.target.id) {
            case 'headline-input':
                headline = event.target.value;
                break;
            case 'newsline-input':
                newsline = event.target.value;
                break;
            case 'img-input':
                let fr = new FileReader();
                fr.onload = function (ev) {
                    img.onload = update;
                    img.src = ev.target.result;
                };
                fr.readAsDataURL(event.target.files[0]);
        }
    }
    let targetWid = 1280;
    let targetHei = 720;
    let wid = img.width;
    let hei = img.height;
    let mod = Math.max(targetWid / wid, targetHei / hei);
    wid *= mod;
    hei *= mod;
    let diffWid = targetWid - wid;
    let diffHei = targetHei - hei;
    context.drawImage(img, diffWid / 2, diffHei / 2, wid, hei);

    fillRect('black', 80, 620, 100, 60);
    fillRect('#FEEB1A', 180, 620, 1100, 60);
    fillRect('#DEDEDEBB', 80, 510, 1200, 110);
    let gradient = context.createLinearGradient(80, 430, 80, 510);
    gradient.addColorStop(0, '#DF352B');
    gradient.addColorStop(0.49, '#B51009');
    gradient.addColorStop(0.5, '#AA0C03');
    gradient.addColorStop(1, '#6D2326');
    fillRect(gradient, 80, 430, 420, 80);
    fillRect('#C2150F', 80, 40, 105, 60);

    fillText('white', '46px', 'Breaking News', 103, 487);
    fillText('black', '68px', headline === '' ? 'Headline' : headline, 100, 590);
    fillText('white', '28px', time, 95, 660);
    fillText('black', '28px', newsline === '' ? 'Newsline' : newsline, 200, 660);
    fillText('white', '36px', 'Live', 95, 85);
    mocha.run();
}

function fillRect(style, x, y, width, height) {
    context.fillStyle = style;
    context.fillRect(x, y, width, height);
}

function fillText(style, fontSize, text, x, y) {
    context.font = '900 ' + fontSize + ' Signika, sans-serif';
    context.fillStyle = style;
    context.fillText(text.toUpperCase(), x, y);
}
