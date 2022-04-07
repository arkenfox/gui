// Name         : userjs-tool-af-mode.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    ////////////////////////////////////////
    // userjsTableViewWhenArkenfoxRepoMode
    //  (used by both userjs-tool.html and arkenfoxGUIStart() calls this)
    ////////////////////////////////////////

    function userjsTableViewWhenArkenfoxRepoMode(theme) {

      // add another index button (as original is hidden)
      document.getElementById("collapse_button").insertAdjacentHTML("beforebegin",
        '<br><select class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + ' afmode_button" id="index_select_2" '
        + 'title="Index">'
        + '<option value="" disabled selected hidden>&#x25BE;Index</option>'
        + '</select>');
      // make index button have same content as original
      document.getElementById("index_select_2").innerHTML =
        document.getElementById("index_select").innerHTML;
      document.getElementById("index_select_2").addEventListener("change", function() {
        indexSelectAction(this);
      });

      document.getElementById("afgui_about_insert").innerHTML =
        document.getElementById("about_textarea").value;

      document.getElementById("filter_select").options[6].disabled=true;
      document.getElementById("filter_select").options[6].hidden=true;
      changeClass(document.getElementById("filter_select"),"","afmode_button");
      document.getElementById("tview_search_input").style.display="block";
      document.getElementById("search_clear_button").style.display="block";
      for (const i of [ "keyup" ] ) {
        document.getElementById("tview_search_input").addEventListener(i, function() {
          userjsTableViewTagFilter(null,this.value); }
        );
      }
      document.getElementById("search_clear_button").addEventListener("click", function() {
        if (!(document.getElementById("tview_search_input").value=="")) {
          userjsTableViewTagFilter(null,"");
        } }
      );

      document.getElementById("about_button").addEventListener("click", function() {
          if (document.getElementById("afgui_about").style.display=="block") {
            document.getElementById("afgui_about").style.display="none";
          }
          else {
            document.getElementById("afgui_about").style.display="block";
          }
        }
      );

      document.getElementById("expand_collapse_button").style.display="block";
      document.getElementById("about_button").style.display="block";
      document.getElementById("version_button").style.display="flex";

      document.getElementById("table_tview").style.maxWidth="1400px";
      document.getElementById("table_tview").style.minWidth="600px";

      //document.getElementById("tableview_heading_afmode").style.display="block";
      //document.getElementById("tableview_heading_afmode").style.backgroundColor="#000000";

      // top bar opaque and re-size
      document.getElementById("tableview_buttons_bar").style.backgroundColor="#000000";
      document.getElementById("tableview_buttons_bar").style.border="1px solid #b3b3b3";
      document.getElementById("tableview_buttons_bar").style.borderWidth="0px 0px 1px 0px";
      document.getElementById("tableview_buttons_bar").style.top="0";
      document.getElementById("tableview_buttons_bar").style.left="0";
      document.getElementById("tableview_buttons_bar").style.width="100%";
      document.getElementById("tableview_buttons_bar").style.padding="0.9em";
      document.getElementById("tableview_buttons_bar").style.height="4em";

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

      // hide some buttons/slider
      for (const id of [ "tableview_heading", "collapse_button",
        "expand_button", "jumpback_button", "jumpnext_button",
        "viewer_slider" ] )
      {
        document.getElementById(id).style.display="none";
      }

      // add button spacing
      for (const id of [ "index_select_2", "expand_collapse_button",
        "filter_select", "about_button" ] )
      {
        document.getElementById(id).style.marginRight="1em";
      }
      for (const id of [ "version_button", "about_button" ] )
      {
        document.getElementById(id).style.marginLeft="1em";
      }

      // disable the prefname links
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
            if (location.protocol == "file:") {
              console.error('// local (file:) fetch failed - firefox flip "security.fileuri.strict_origin_policy" (and change it back afterwards)');
            }
            alert("File fetch error:\n" + err.message + msg);
          });
          setTimeout(function(){
            userjsTableView(text_box,getURLVariable("t"),getURLVariable("s"));
            var theme = document.body.className.replace( /(^| *)[^_]+_/ , '');
            userjsTableViewWhenArkenfoxRepoMode(theme);
          }, 1000);
      }
      else {
        userjsTableView(text_box,getURLVariable("t"),getURLVariable("s"));
        var theme = document.body.className.replace( /(^| *)[^_]+_/ , '');
        userjsTableViewWhenArkenfoxRepoMode(theme);
      }

      // provide the user.js from main as base64
      if (/^\?(b)($|&)/.test(location.search)) {
        setTimeout(function(){
          document.getElementById("tableview_div").insertAdjacentHTML("afterbegin",
            '<textarea readonly>'
            + '// ' + (returnDateTime()) + " user.js as base64 from main repo\n"
            + '// place this in a file named "userjs-base64.js"\n'
            + 'const userjsbase64="'
            + (b64EncodeUnicode(txtbx.value))
            + '"</textarea>');
          }, 1000);
      }

      // list the urls in the hardcoded user.js
      if (/^\?(u)($|&)/.test(location.search)) {
        // https://javascript.tutorialink.com/extract-urls-from-paragraph-or-block-of-text-using-a-regular-expression/
        var urlRegex = /((mailto:|ftp:\/\/|https?:\/\/)\S+?)[^\s]+/ig;
        document.getElementById("tableview_div").insertAdjacentHTML("afterbegin",
          '<textarea readonly>'
          + '// ' + (returnDateTime()) + " URLs from user.js in arkenfox gui\n"
          + (txtbx.value.match(urlRegex).join('\n'))
          + '</textarea>');
      }

    }
