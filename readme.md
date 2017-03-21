*Quick start

- npm install
- bower install
- gulp serve

<!doctype html>
<html class="no-js" lang="en">
  <head>
    <title>Guide Me js lib</title>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Foundation Starter Template</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.0/css/foundation.min.css">
    <link type="text/css" rel="stylesheet" href="css/app.css">
  </head>
  <body>
    <div class="main">
      <div class="row">
        <div class="medium-9 columns">
          <div class="hide">
            <span class="arrow">
              <span class="arrow__c"></span>
              <span class="arrow__a"></span>
            </span>    
          </div>
          <form>
            <div class="row">
              <div class="medium-12 columns">
                  <h1>guide Me sample <a href="javascript:void(0);" onclick="javascript:guideMeJs().show(this);" class="small button success" data-guideme-trigger="demo.block">Show guide block 1</a></h1>
              </div>
            </div>
            <div class="row">
              <div class="medium-6 columns">
                <label>Input Label
                  <input type="text" placeholder=".medium-6.columns" data-guideme-id="demo.block[block1]" data-guideme-pos="left top" data-guideme-text="hallo world123<br> <b>here</b> you can type <span style='color:red;'>a lot of</span> text" data-guideme-offset="20">
                </label>
              </div>
              <div class="medium-6 columns">
                <label>Input Label
                  <input type="text" placeholder=".medium-6.columns" data-guideme-id="demo.block[block2]" data-guideme-pos="right top" data-guideme-text="hallo world2345, here you can type a lot of text. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. And last time" data-guideme-offset="20">
                </label>
              </div>
            </div>
            <div class="row">
              <div class="medium-6 columns">
                <label>Input Label
                  <input class="__hide" type="text" placeholder=".medium-6.columns" data-guideme-id="demo.block[block3]" data-guideme-pos="left bottom" data-guideme-text="hallo world66778, here you can type a lot of text" data-guideme-offset="0">
                </label>
              </div>
              <div class="medium-6 columns hide">
                <label>Input Label
                  <input type="text" placeholder=".medium-6.columns" data-guideme-id="demo.block[block4]" data-guideme-pos="top left" data-guideme-text="hallo world99008767, here you can type a lot of text" data-guideme-offset="0">
                </label>
              </div>
            </div>
            <div class="row">
              <div class="medium-12 columns">
                <a href="javascript:void(0);" onclick="javascript:guideMeJs().show(this);" class="small button success" data-guideme-trigger="demo.nextblock">Show guide block 2</a>
                <fieldset class="fieldset" data-guideme-id="demo.nextblock" data-guideme-pos="right top" data-guideme-text="hallo world, here you can type ...hallo world, here you can type ...hallo world, here you can type ...hallo world, here you can type ...hallo world, here you can type ..." data-guideme-offset="10">
                  <legend>Check these out</legend>
                  <input id="checkbox12" type="checkbox"><label for="checkbox12">Checkbox 1</label>
                  <input id="checkbox22" type="checkbox"><label for="checkbox22">Checkbox 2</label>
                  <input id="checkbox32" type="checkbox"><label for="checkbox32">Checkbox 3</label>
                </fieldset>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha256-/SIrNqv8h6QGKDuNoLGA4iret+kyesCkHGzVUUV0shc=" crossorigin="anonymous">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.0/js/foundation.min.js"></script>
    <script type="text/javascript" src="js/app.js"></script>
  </body>
</html>
