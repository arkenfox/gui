// Name         : userjs-tool-af-mode.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.08

    ////////////////////////////////////////
    // userjsTableViewWhenArkenfoxRepoMode
    //  (used by both userjs-tool.html and arkenfoxGUIStart() calls this)
    ////////////////////////////////////////

    function userjsTableViewWhenArkenfoxRepoMode() {

      var theme = document.body.className.replace( /(^| *)[^_]+_/ , '');

      // hide some elements
      var e = document.getElementsByClassName("afmode2none");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].style.display="none";
      }
      // reveal some elements
      var e = document.getElementsByClassName("afmode2block");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].style.display="block";
      }
      var e = document.getElementsByClassName("afmode2flex");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].style.display="flex";
      }

      // add another index button (as original is hidden)
      document.getElementById("tview_collapse_button").insertAdjacentHTML("beforebegin",
        '<br><select id="tview_index_select" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme + ' afmode_button"'
        + ' title="Index">'
        + '<option value="" disabled selected hidden>&#x25BE;Index</option>'
        + '</select>');

      // make index button have same content as original
      document.getElementById("tview_index_select").innerHTML =
        document.getElementById("index_select").innerHTML;

      document.getElementById("tview_index_select").options[0].innerHTML=
        '&#x00A0;&#x261B;&#x00A0;&#x00A0;Index'

      // place "About" text into element
      if (!!(document.getElementById("about_textarea"))) {
        document.getElementById("tview_about_inner_div").innerHTML =
          document.getElementById("about_textarea").value;
      }
      else {
        // if no text just put the arkenfox url
        document.getElementById("tview_about_inner_div").innerHTML =
          '<a target="_blank" rel="external noopener noreferrer" '
          + 'class="http" href="https://github.com/arkenfox/user.js"'
          + '>https://github.com/arkenfox/user.js</a>';
      }

      // hide the search option under the filter button
      var e = document.getElementById("tview_filter_select_search_option");
      e.disabled=true;
      e.hidden=true;

      changeClass(document.getElementById("tview_filter_select"),"","afmode_button");


      // event listeners

      // [Index] button
      document.getElementById("tview_index_select").addEventListener("change", function() {
        indexSelectAction(this);
      });

      // [Search] box
      document.getElementById("tview_search_input").addEventListener("keyup", function() {
        userjsTableViewTagFilter(null,this.value);
      });

      document.getElementById("tview_search_clear_button").style.borderTop = "0px";
      document.getElementById("tview_search_clear_button").style.borderRight = "0px";
      document.getElementById("tview_search_clear_button").style.borderBottom = "0px";
      
      // search clear button
      document.getElementById("tview_search_clear_button").addEventListener("click", function() {
        if (!(document.getElementById("tview_search_input").value=="")) {
          userjsTableViewTagFilter(null,"");
        }
      });

      // [About] button (toggle)
      document.getElementById("tview_about_button").addEventListener("click", function() {
        if (document.getElementById("tview_about_div").style.display=="block") {
          document.getElementById("tview_about_div").style.display="none";
        }
        else {
          document.getElementById("tview_about_div").style.display="block";
        }
      });

      // top bar opaque and re-size
      var e = document.getElementById("tview_buttons_div");
      e.style.backgroundColor="#000000";
      e.style.border="1px solid #b3b3b3";
      e.style.borderWidth="0px 0px 1px 0px";
      e.style.top="0";
      e.style.width="100%";
      e.style.padding="0.9em 0";
      e.style.height="4em";
      e.style.maxWidth = "1400px";
      e.style.margin = "0 auto";
      e.style.zIndex = "100";

      // max/min width
      document.body.style.maxWidth = "1400px";
      document.body.style.margin = "0 auto";
      document.body.style.float = "none";
      document.getElementById("table_tview").style.minWidth="600px";

      // inactive pref background
      var e = document.getElementsByClassName("tr_tview_inactive");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].style.backgroundColor="#313131";
      }

      // adjust offsets (for preventing content hidden behind top bar)
      if (!!(document.getElementById("body_offset"))) {
        document.getElementById("body_offset").innerHTML="";
      }
      document.getElementById("tableview_offset").innerHTML="";
      document.getElementById("tableview_div").style.marginTop="7em";
      var e = document.getElementsByClassName("anchor");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].style.marginTop="-7em";
        e[i].style.paddingBottom="7em";
      }

      // add some button margins
      document.getElementById("tview_index_select").style.marginLeft="2em";
      for (const id of [ "tview_index_select", "tview_expand_collapse_button",
        "tview_filter_select", "tview_about_button" ] )
      {
        document.getElementById(id).style.marginRight="1em";
      }
      for (const id of [ "tview_version_div", "tview_about_button" ] )
      {
        document.getElementById(id).style.marginLeft="1em";
      }

      // disable the prefname about:config search formatted links
      var e = document.getElementsByClassName("td_tview_name");
      for (var i = 0, j = e.length; i < j; i++) {
        var e2 = e[i].getElementsByTagName("a");
        for (var i2 = 0, j2 = e2.length; i2 < j2; i2++) {
          e2[i2].removeAttribute("href");
        }
      }

    } /* end function userjsTableViewWhenArkenfoxRepoMode */


    ///////////////////////////////////////
    // userjstoolWhenArkenfoxRepoMode
    //  (used by userjs-tool.html)
    ///////////////////////////////////////
    
    function userjstoolWhenArkenfoxRepoMode() {
      if (getURLVariable("afmode")=="off") {
        arkenfoxRepoMode="";
      }
      else if (getURLVariable("afmode")=="demo"
        || getURLVariable("afmode")=="test"
      ) {
        arkenfoxRepoMode=getURLVariable("afmode");
      }
      else if (
        /^https:\/\/arkenfox\.github\.io\//.test(location)
        || (getURLVariable("afmode")=="on")
      ) {
        arkenfoxRepoMode="on";
      }
    } /* end function userjstoolWhenArkenfoxRepoMode */


    ////////////////////////////////////////////////
    // arkenfoxGUIStart
    //   (used by arkenfox-gui.html)
    //     (aka index.html on arkenfox gui repo)
    ////////////////////////////////////////////////

    function arkenfoxGUIStart(text_box="") {

      var txtbx = document.getElementById(text_box);

      document.body.style.fontSize = "70%";

      // must have these ids or it breaks
      txtbx.insertAdjacentHTML("afterend",
        '<select id="index_select" style="display:none;"></select>'
        +'<div id="view_area" class="view_area_arkenfox"></div>');

      var timeout = 0;

      if ( (txtbx.value=="")
        || (/^\?(a|b)($|&)/.test(location.search))
      ) {
        // fetch file from main repo instead
        txtbx.value="";
        var url="https://raw.githubusercontent.com/arkenfox/user.js/master/user.js";
        var msg = "\nTroubleshooting:  Check connection?"
          + "  Blocked by an extension (eg uMatrix XHR)?"
          + "  Site allows fetch?  Valid URL/file?\n"
          + url;
        fetch(url)
          .then(function(response) {
            if (response.ok) {
              return response.text()
            }
            else {
              throw Error(response.status);
            }
          })
          .then(function(text) {
            txtbx.value = text;
          })
          .catch(function(err) {
            alert("File fetch error:\n" + err.message + msg);
          });
          timeout = 1000;
      }

      setTimeout(function(){
        userjsTableView(text_box,getURLVariable("t"),getURLVariable("s"));
        userjsTableViewWhenArkenfoxRepoMode();
      }, timeout);

      // provide the user.js from main as base64
      if (/^\?(b)($|&)/.test(location.search)) {
        setTimeout(function(){
          document.getElementById("tableview_div").insertAdjacentHTML("afterbegin",
            '<textarea readonly>'
            + '// ' + (returnDateTime()) + " user.js as base64 from main repo\n"
            + '// place this in a file named "userjs-base64.js"\n'
            + 'const userjsbase64="' + (b64EncodeUnicode(txtbx.value)) + '"\n'
            + '</textarea>');
          }, 1000);
      }

      // list the urls in the hardcoded user.js
      if (/^\?(u)($|&)/.test(location.search)) {
        setTimeout(function(){
          // https://javascript.tutorialink.com/extract-urls-from-paragraph-or-block-of-text-using-a-regular-expression/
          var urlRegex = /((mailto:|ftp:\/\/|https?:\/\/)\S+?)[^\s]+/ig;
          document.getElementById("tableview_div").insertAdjacentHTML("afterbegin",
            '<textarea readonly>'
            + '// ' + (returnDateTime()) + " URLs from user.js in arkenfox gui\n"
            + (txtbx.value.match(urlRegex).join('\n')) + "\n"
            + '</textarea>');
        }, 500);
      }

    }
