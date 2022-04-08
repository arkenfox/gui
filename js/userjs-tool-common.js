// Name         : userjs-tool-common.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.07

    // *************************************
    // returnDateTime
    // *************************************

    function returnDateTime() {
      var d = new Date();
      // var months = ["Jan","Feb","Mar","Apr","May","Jun",
      //   "Jul","Aug","Sep","Oct","Nov","Dec"];
      // var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      // Date.now() Get the time. ECMAScript 5.
      return d.getFullYear()
        // + months[d.getMonth()]
        + ((d.getMonth()+1) < 10 ? "0" : "") + (d.getMonth()+1)
        + (d.getDate() < 10 ? "0" : "") + d.getDate() + "_"
        // + days[d.getDay()]
        + (d.getHours() < 10 ? "0" : "") + d.getHours()
        + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes()
        + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
        // + "." + getMilliseconds();
    }

    // *************************************
    // RegExp.escape
    // *************************************

    // function to escape a variable for use in regex
    // https://stackoverflow.com/questions/6318710/javascript-equivalent-of-perls-q-e-or-quotemeta

    RegExp.escape = function(text) {
      return (text+'').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    // *************************************
    // b64EncodeUnicode/b64DecodeUnicode
    // *************************************

    // functions to base64 encode/decode (and cope with Unicode characters)
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem

    function b64EncodeUnicode(str) {
      // first we use encodeURIComponent to get percent-encoded UTF-8,
      // then we convert the percent encodings into raw bytes which
      // can be fed into btoa.
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
      }));
    }

    function b64DecodeUnicode(str) {
      // Going backwards: from bytestream, to percent-encoding, to original string.
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }

    // *************************************
    // computedStyle
    // *************************************

    // function to get element style values
    // https://stackoverflow.com/questions/6134471/using-elements-that-are-added-to-an-array-with-document-getelementbyidid/6134501#6134501
    //   var element = document.getElementById('Img3');
    //   alert(computedStyle(element,'width'));

    var computedStyle = function (el,style) {
      var cs;
      if (typeof el.currentStyle != 'undefined') {
        cs = el.currentStyle;
      }
      else {
        cs = document.defaultView.getComputedStyle(el,null);
      }
      return  cs[style];
    }

    // *************************************
    // escapeHtml
    // *************************************

    // function to replace & < > " ' characters with HTML escape codes
    // action = decode+quotes|encode+quotes|decode|encode
    //          (blank or anything else = encode)
    // based on code from:
    // https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406

    function escapeHtml(text, action) {
      if (action == "decode+quotes") {
        // decode (+ quotes)
        var map = { '&amp;': '&', '&lt;': '<', '&gt;': '>',
          '&quot;': '"', '&#039;': "'" };
        return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g,
          function(m) { return map[m]; });
      }
      else if (action == "encode+quotes") {
        // encode (+ quotes)
        var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;',
          '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      }
      else if (action == "decode") {
        // decode
        var map = { '&amp;': '&', '&lt;': '<', '&gt;': '>' };
        return text.replace(/&amp;|&lt;|&gt;/g,
          function(m) { return map[m]; });
      }
      else {
        // encode
        var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
        return text.replace(/[&<>]/g, function(m) { return map[m]; });
      }
    }

    // *************************************
    // changeClass
    // *************************************

    // based on code from:
    // https://stackoverflow.com/questions/195951/change-an-elements-css-class-with-javascript

    function changeClass(object,oldClass,newClass)
    {
      if (oldClass == "") {
        if ( ! /(?:^|\s)newClass(?!\S)/.test(object.className) ) {
          object.className += " "+newClass;
        }
      }
      else {
        var regExp = new RegExp('(?:^|\\s)' + oldClass + '(?!\\S)', 'ig');
        object.className = object.className.replace( regExp , newClass );
      }
    }

    // *************************************
    // getURLVariable
    // *************************************

    /* process URL variables */
    // https://stackoverflow.com/questions/831030/how-to-get-get-request-parameters-in-javascript

    function getURLVariable(name){
      // window.location.search.substring(1)
      if (name=(new RegExp('[?&]'
        + encodeURIComponent(name) + '=([^&#]*)')).exec(location.search))
        return decodeURIComponent(name[1])
    }

    // *************************************
    // amendCodeComments
    // *************************************

    /*
        function to either:
        (1) remove javascript comments, or
        (2) convert in-block comments to in-line
        based on removeCodeComments function from:
        https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline#52630274
        and modified to add:  convertInBlockToInLine (optional)  asteriskPosition (fix)
    */

    function amendCodeComments(code="", convertInBlockToInLine=false) {
      var inQuoteChar = null;
      var inBlockComment = false;
      var asteriskPosition = null;
      var inLineComment = false;
      var inRegexLiteral = false;
      var newCode = '';
      for (var i=0,j=code.length;i<j;i++) {
        if (!inQuoteChar && !inBlockComment && !inLineComment && !inRegexLiteral) {
          if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
            inQuoteChar = code[i];
          }
          else if (code[i] === '/' && code[i+1] === '*') {
            inBlockComment = true;
            asteriskPosition = i+1;
            if (convertInBlockToInLine) {
              newCode += '// ';
            }
          }
          else if (code[i] === '/' && code[i+1] === '/') {
            inLineComment = true;
          }
          else if (code[i] === '/' && code[i+1] !== '/') {
            inRegexLiteral = true;
          }
        }
        else {
          if (
            inQuoteChar && ((code[i] === inQuoteChar && code[i-1] != '\\')
            || (code[i] === '\n' && inQuoteChar !== '`'))
          ) {
            inQuoteChar = null;
          }
          if (
            inRegexLiteral && ((code[i] === '/' && code[i-1] !== '\\')
            || code[i] === '\n')
          ) {
            inRegexLiteral = false;
          }
          /* ensure asterisk is fresh to handle slash after opening comment */
          if (
            inBlockComment && code[i-2] === '*' && code[i-1] === '/'
            && i-2 > asteriskPosition
          ) {
            inBlockComment = false;
            asteriskPosition = null;
            if (convertInBlockToInLine && code[i] !== '\n') {
              newCode += '\n';
            }
          }
          if (inLineComment && code[i] === '\n') {
            inLineComment = false;
          }
        }
        if ((!inBlockComment && !inLineComment) || convertInBlockToInLine) {
          newCode += code[i];
        }
        if (convertInBlockToInLine && inBlockComment && code[i] === '\n') {
            newCode += '// ';
        }
      }
      return newCode;
    } /* end function amendCodeComments */

    // *************************************
    // indexSelectAction
    // *************************************

    function indexSelectAction(element) {
      // expand, focus, and scroll to the chosen section
      var id = element.value;
      // make the select element show first choice (button title)
      element.selectedIndex = 0;
      element.blur();
      if (id) {
        if (
          /(compare_div|tableview_div)/
          .test(document.getElementById("view_area").innerHTML)
        ) {
          /* for compare or tableview */
          document.getElementById("tview_slider").value = id;
          if (id == 0) {
            scroll(0,0);
          }
          else {
            document.getElementById(id).scrollIntoView();
          }
        }
        else {
          var e = document.getElementById(id);
          if (e) {
            e.nextElementSibling.style.display = "block";
            section_focus = e;
            refocusSection();
          }
          else if (id == "(TOP) / Introduction") {
            scroll(0,0);
          }
        }
      }
    }
