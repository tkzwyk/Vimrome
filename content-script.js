$(function(){

  var isInsertMode = false;

  $("input").focus(function(){
    isInsertMode = true;
  }).blur(function(){
    isInsertMode = false;
  });

  window.addEventListener( "keydown", (function(e){
    var n = 10;
    var isNeedCancel = true;

    if ( !isInsertMode ) {
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
        default:
          isNeedCancel = false;
          break;
      }

      if ( isNeedCancel ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }), true );
});

