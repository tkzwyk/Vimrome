const KEY_ESC = 27;
const KEY_INSERT = 45;
var isIgnoreMode;
var notify = null;

function SwitchNotification() {
  if ( isIgnoreMode ) {
    notify = noty({text: "Ignore All keys (Press &lt;Shift-Esc&gt; or &lt;Insert&gt; to exit)"});
  }
  else if ( notify != null ) {
    notify.close();
    notify = null;
  }
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ( namespace == "local" ) {
    if ( changes.isIgnoreMode ) {
      isIgnoreMode = changes.isIgnoreMode.newValue;
      SwitchNotification();
    }
  }
});

$(function(){
  var isInsertMode = false;
  var inputtedStr = "";

  chrome.storage.local.get("isIgnoreMode", function(item) {
    if ( typeof item.isIgnoreMode === "undefined" ) {
      chrome.storage.local.set({'isIgnoreMode': false}, function(){});
    }
    else {
      isIgnoreMode = item.isIgnoreMode;
      SwitchNotification();
    }
  });

  $("input").focus(function(){
    isInsertMode = true;
  }).blur(function(){
    isInsertMode = false;
  });

  window.addEventListener( "keydown", (function(e){
    var n = 10;
    var isNeedCancel = true;

    if ( (e.shiftKey && e.keyCode == KEY_ESC) || e.keyCode == KEY_INSERT ) {
      isIgnoreMode = !isIgnoreMode;
      chrome.storage.local.set({'isIgnoreMode': isIgnoreMode}, function(){});

      e.preventDefault();
      e.stopPropagation();
      inputtedStr = "";
      return;
    }

    if ( !isInsertMode && !isIgnoreMode ) {
      if ( !e.altKey && e.ctrlKey && !e.shiftKey ) {
        var h = window.innerHeight;
        switch ( String.fromCharCode(e.keyCode) ) {
          case 'F':
            window.scrollBy( 0, h );
            break;
          case 'B':
            window.scrollBy( 0, h * -1 );
            break;
          case 'D':
            window.scrollBy( 0, h / 2 );
            break;
          case 'U':
            window.scrollBy( 0, (h / 2) * -1 );
            break;
          case 'O':
            history.back();
            break;
          case 'I':
            history.forward();
            break;
          case 'P':
            chrome.runtime.sendMessage({cmd: "movePrevTab"});
            break;
          default:
            isNeedCancel = false;
            inputtedStr = "";
            break;
        }
      }
      else if ( !e.altKey && !e.ctrlKey && e.shiftKey ) {
        switch ( String.fromCharCode(e.keyCode) ) {
          case 'G':
            $(window).scrollTop( $(document).height() );
            break;
          case 'H':
            history.back();
            break;
          case 'L':
            history.forward();
            break;
          default:
            isNeedCancel = false;
            inputtedStr = "";
            break;
        }
      }
      else if ( !e.altKey && !e.ctrlKey && !e.shiftKey ) {
        switch ( String.fromCharCode(e.keyCode) ) {
          case 'H':
            window.scrollBy( n * -1, 0 );
            break;
          case 'J':
            window.scrollBy( 0, n );
            break;
          case 'K':
            window.scrollBy( 0, n * -1 );
            break;
          case 'L':
            window.scrollBy( n, 0 );
            break;
          case 'G':
            if ( inputtedStr == 'G' ) {
              $(window).scrollTop( 0 );
              inputtedStr = "";
            }
            else {
              inputtedStr = 'G';
            }
            break;
          case 'D':
            chrome.runtime.sendMessage({cmd: "removeTab"});
            break;
          case 'R':
            location.reload( true );
            break;
          default:
            isNeedCancel = false;
            inputtedStr = "";
            break;
        }
      }
      else {
        isNeedCancel = false;
        inputtedStr = "";
      }

      if ( isNeedCancel ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }), true );
});

