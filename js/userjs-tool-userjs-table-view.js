// Name         : userjs-tool-userjs-table-view.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // various functions for userjsTableView
    // *************************************

    function userjsTableViewExpandAll() {
      var e = document.getElementsByClassName("det");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].open = true;
      }
    }

    function userjsTableViewExpandPrefDesc() {
      userjsTableViewCollapseSectionDesc();
      var e = document.getElementsByClassName("prefDet");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].open = true;
      }
    }

    function userjsTableViewCollapseSectionDesc() {
      var e = document.getElementsByClassName("secDet");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].open = false;
      }
    }

    function userjsTableViewCollapseAll() {
      var e = document.getElementsByClassName("det");
      for (var i = 0, j = e.length; i < j; i++) {
        e[i].open = false;
      }
    }

    function userjsTableViewExpandCollapseAll() {
      var b = document.getElementById("expand_collapse_button");
      userjsTableViewCollapseAll();
      if (/Expand/.test(b.innerHTML)) {
        userjsTableViewExpandPrefDesc();
        b.innerHTML='<b>-</b><span class="button_text"> Collapse</span>';
      }
      else {
        b.innerHTML='<b>+</b><span class="button_text"> Expand</span>';
      }
    }

    ////////////////////////////////////////////////////////
    // userjsTableViewUpdateURLBar
    ////////////////////////////////////////////////////////

    function userjsTableViewUpdateURLBar(textToAdd="",filterType="") {
      if (filterType=="t") {
        // tags are already URI encoded
        textToAdd=textToAdd.replace(/^TAGS_/,"");
        textToAdd="t="+textToAdd;
      }
      else if (filterType=="s") {
        textToAdd=encodeURIComponent(textToAdd);
        textToAdd="s="+textToAdd;
      }
      else if (textToAdd) {
        textToAdd=encodeURIComponent(textToAdd);
      }
      
      if (getURLVariable("afmode")) {
        if (textToAdd) {
          textToAdd=textToAdd.replace(/^/,"afmode="+(getURLVariable("afmode"))+"\&");
        }
        else {
          textToAdd="afmode="+(getURLVariable("afmode"));
        }
      }
      // location.protocol + "//" + location.pathname + textToAdd;
      // https://stackoverflow.com/questions/824349/how-do-i-modify-the-url-without-reloading-the-page
      // location.search += textToAdd;
      window.history.replaceState(null, document.title,"?"+textToAdd);
    }

    ////////////////////////////////////////////////////////
    // userjsTableViewTagFilter
    ////////////////////////////////////////////////////////

    function userjsTableViewTagFilter(filter_tag=null,filter_search=null) {
      var s = document.getElementById("filter_select");
      var svalue = s.value;
      s.selectedIndex = 0;
      var hideheadingsoption = 2;
      var hideinactiveoption = 3;
      var hideactiveoption = 4;
      var invertoption = 5;
      var searchoption = 6;
      var firstfilteronoption = 6;
      var search_item_count = 0, search_line_count = 0;
      var e = document.getElementById("table_tview").querySelectorAll("tr");
      var group_user_pref_list_filter = "";

      // get menu status
      var hideinactive =
        /\u{25A3}/u.test(s.options[hideinactiveoption].textContent) ? true : false;
      var hideactive =
        /\u{25A3}/u.test(s.options[hideactiveoption].textContent) ? true : false;
      var hideheadings =
        /\u{25A3}/u.test(s.options[hideheadingsoption].textContent) ? true : false;
      var invert =
        /\u{25A3}/u.test(s.options[invertoption].textContent) ? true : false;
      var search_regexp =
        s.options[searchoption].textContent.replace(/^.*\u{00A0}/u, "");
      var filteron = "";
      for (var si = firstfilteronoption, sj = s.options.length; si < sj; si++) {
        if (/\u{25A3}/u.test(s.options[si].textContent)) {
          filteron = s.options[si].value;
        }
      }

      if ( (filter_tag) && (filter_search) ) {
        // cannot do both
        alert("cannot filter for a tag and search text");
        return;
      }
      else if (filter_tag) {
        svalue = "TAGS_" + encodeURIComponent(filter_tag);
        filteron = svalue;
        hideheadings = true;
        userjsTableViewUpdateURLBar(svalue,"t");
      }
      else if ((filter_search) && !(filter_search=="")) {
        svalue = "SEARCH";
        search_regexp = filter_search;
        filteron = svalue;
        hideheadings = true;
        userjsTableViewUpdateURLBar(search_regexp,"s");
      }
      else if ((svalue == "SHOWALL") || (filter_search=="")) {
        svalue = "SHOWALL";
        hideinactive = false;
        hideactive = false;
        hideheadings = false;
        invert = false;
        filteron = "";
        userjsTableViewUpdateURLBar("");
        document.getElementById("tview_search_input").value="";
      }
      else if (svalue == "HIDEHEADINGS") {
        svalue = "";
        hideheadings = !hideheadings;
      }
      else if (svalue == "HIDEINACTIVE") {
        svalue = "";
        hideinactive = !hideinactive;
        hideactive = false;
      }
      else if (svalue == "HIDEACTIVE") {
        svalue = "";
        hideactive = !hideactive;
        hideinactive = false;
      }
      else if (svalue == "INVERT") {
        svalue = "";
        invert = !invert;
      }
      else if (svalue == "SEARCH") {
        var new_regexp = prompt("\u{1f50d} Enter text to find (RegExp syntax)\n"
          + " eg  clear  \\.clear  letter.*box|inner  \\b(netflix|eme|gmp|cdm|drm)\\b"
          , search_regexp);
        if (new_regexp == null) {
          // prompt cancel button was clicked
          svalue = "";
        }
        else if (new_regexp=="") {
          svalue = "SHOWALL";
          hideinactive = false;
          hideactive = false;
          hideheadings = false;
          invert = false;
          filteron = "";
          userjsTableViewUpdateURLBar("");
          document.getElementById("tview_search_input").value="";
        }
        else {
          search_regexp = new_regexp;
          filteron = svalue;
          hideheadings = true;
          userjsTableViewUpdateURLBar(search_regexp,"s");
          document.getElementById("tview_search_input").value=new_regexp;
        }
      }
      else if (svalue == filteron) {
        svalue = "SHOWALL";
        filteron = "";
        hideheadings = false;
        userjsTableViewUpdateURLBar("");
      }
      else {
        filteron = svalue;
        hideheadings = true;
        userjsTableViewUpdateURLBar(svalue,"t");
      }

      // loop through all tr and apply/re-apply filter
      for (var i = 1, j = e.length; i < j; i++) {
        e[i].style.display =
          (svalue == "SHOWALL" || filteron == "SEARCH"
            || new RegExp(filteron + " ").test(e[i].className))
          ? null : "none";
      }
      // if search
      if (filteron == "SEARCH") {
        for (var i = 1, j = e.length; i < j; i++) {
          if (new RegExp(search_regexp,"ig").test(e[i].textContent)) {
            e[i].style.display = null;
            if (!(/HEADING /.test(e[i].className))) {
              // count matches
              search_line_count++;
              search_item_count+=((e[i].textContent || '')
                .match(new RegExp(search_regexp,"ig")) || []).length;
            }
          }
          else {
            e[i].style.display = "none"
          }
        }
      }
      // if invert
      if (invert) {
        for (var i = 1, j = e.length; i < j; i++) {
          e[i].style.display = (e[i].style.display == "none") ? null : "none";
        }
      }
      // if hide inactive
      if (hideinactive) {
        for (var i = 1, j = e.length; i < j; i++) {
          if (/TAGS_Inactive /.test(e[i].className)) {
            e[i].style.display = "none";
          }
        }
      }
      // if hide active
      if (hideactive) {
        for (var i = 1, j = e.length; i < j; i++) {
          if (/TAGS_Active /.test(e[i].className)) {
            e[i].style.display = "none";
          }
        }
      }
      // hide/unhide headings
      for (var i = 1, j = e.length; i < j; i++) {
        if (/HEADING /.test(e[i].className)) {
          e[i].style.display = hideheadings ? "none" : null;
        }
      }

      // mark the filter options on/off on the filter select/button
      s.options[hideinactiveoption].textContent = hideinactive
        ? s.options[hideinactiveoption].textContent.replace(/\u{25A2}/u, "\u25A3")
        : s.options[hideinactiveoption].textContent.replace(/\u{25A3}/u, "\u25A2");
      s.options[hideactiveoption].textContent = hideactive
        ? s.options[hideactiveoption].textContent.replace(/\u{25A2}/u, "\u25A3")
        : s.options[hideactiveoption].textContent.replace(/\u{25A3}/u, "\u25A2");
      s.options[hideheadingsoption].textContent = hideheadings
        ? s.options[hideheadingsoption].textContent.replace(/\u{25A2}/u, "\u25A3")
        : s.options[hideheadingsoption].textContent.replace(/\u{25A3}/u, "\u25A2");
      s.options[invertoption].textContent = invert
        ? s.options[invertoption].textContent.replace(/\u{25A2}/u, "\u25A3")
        : s.options[invertoption].textContent.replace(/\u{25A3}/u, "\u25A2");
      // search option - show count and the searched text
      s.options[searchoption].textContent =
        s.options[searchoption].textContent
          .replace(/^(.*\()[0-9;]*(\)\u{00A0}).*$/u, "$1"
            + search_line_count + ";" + search_item_count + "$2" + search_regexp);
      // mark the filter used and unmark others (except hide/invert)
      for (var si = firstfilteronoption, sj = s.options.length; si < sj; si++) {
        s.options[si].textContent = (s.options[si].value == filteron)
          ? s.options[si].textContent.replace(/\u{25A2}/u, "\u25A3")
          : s.options[si].textContent.replace(/\u{25A3}/u, "\u25A2");
      }
      // filter button (indicates if any filter is used)
      s.options[0].textContent =
        (hideinactive || hideactive || hideheadings || invert || filteron)
        ? s.options[0].textContent.replace(/\u{25A2}/u, "\u25A3")
        : s.options[0].textContent.replace(/\u{25A3}/u, "\u25A2");

      // for testing, get the Filter select options and counts in an alert
      // alert(s.textContent.replace(/[\u{25A2}\u{25A3}]/ug, "\n$0"));

      // update group_link_showing_table_filter (inside groups_container div)
      var prefnametd;
      for (var i = 1, j = e.length; i < j; i++) {
        if (!(e[i].style.display == "none")) {
          // get prefname from table text (where e[i] is the tr)
          prefnametd = e[i].getElementsByClassName("td_tview_name");
          if (prefnametd.length > 0) {
            if (prefnametd[0].textContent) {
              group_user_pref_list_filter +=
                prefnametd[0].textContent.replace(/([*.+])/g, "\\$1") + "|";
            }
          }
        }
      }
      if(!!(document.getElementById("group_link_showing_table_filter"))) {
        document.getElementById("group_link_showing_table_filter").href =
          'about:config?filter=/^\\*$|^('
          + group_user_pref_list_filter.replace(/\|$/, '')
          + ')(;|$)|^$/i';
      }
      s.blur();

    } /* end function userjsTableViewTagFilter */

    ////////////////////////////////////////////////////////
    // userjsTableView
    ////////////////////////////////////////////////////////

    function userjsTableView(input_box_name,filter_tag="",filter_search="") {

      var input_box = document.getElementById(input_box_name);

      var theme = document.body.className.replace( /(^| *)[^_]+_/ , '');

      // tags (shown under filter button in this order)
      //   these are used on the table row eg: <tr class="TAGS_WARNING "...>
      //   those below are hardcoded (with an indicator code for the info column)
      //   any other tags will be detected later (and use a * as indicator code)
      var tags = {
        // tags to show first
        'WARNING': {
          'rx': new RegExp("(\\[WARNING\\]|\\[WARNING.)", "gi"),
          're': '<span class="warn">$1</span>',
          'indicator': '<span class="warn">W</span>',
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'HIDDEN': {
          'rx': new RegExp("(\\[HIDDEN[^\\]]*\\])", "gi"),
          're': '<span class="hid">$1</span>',
          'indicator': '<span class="hid">H</span>',
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'SETUP': {
          'option_name': 'SETUP... (listed below)',
          'rx': new RegExp("(\\[SETUP[^\\]]*\\])", "gi"),
          're': '<span class="setup">$1</span>',
          'indicator': '<span class="setup">S</span>',
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'DEFAULT': {
          'rx': new RegExp("(\\[DEFAULT[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "D",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        // other tags
        'FF': {
          'option_name': 'FF... (listed below)',
          'rx': new RegExp("(\\[FF[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "F",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'NOTE': {
          'rx': new RegExp("(\\[NOTE[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "N",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'WHY': {
          'rx': new RegExp("(\\[WHY[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "Y",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'RESTART': {
          'rx': new RegExp("(\\[RESTART[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "R",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'SETTING': {
          'rx': new RegExp("(\\[SETTING[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "X",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'TEST': {
          'rx': new RegExp("(\\[TEST[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "T",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'TIP': {
          'rx': new RegExp("(\\[TIP[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "I",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        // os
        'WINDOWS': {
          'rx': new RegExp("(\\[WINDOWS[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "M",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'NON-WINDOWS': {
          'rx': new RegExp("(\\[NON-WINDOWS[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "O",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'MAC': {
          'rx': new RegExp("(\\[MAC[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "A",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        },
        'LINUX': {
          'rx': new RegExp("(\\[LINUX[^\\]]*\\])", "gi"),
          're': "",
          'indicator': "L",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        }
      }

      // check for "[TAGS]" not hardcoded above
      var extraTags = input_box.value
        // make [TAGS] be on their own line
        .replace(/(\[[^\]]*\])/gm,'\n$1\n')
        .split("\n")
        // keep just the [TAGS] lines
        .filter(function(value) { return /^\[.*\]$/.test(value) })
        // unique values
        .filter(function(value, index, self) { return self.indexOf(value) === index })
        // prefix [TAGS] for sort priority (SETUP and FF to the end)
        .map(function(value) {
          if (new RegExp("^(\\[FF[^\\]]*\\])").test(value) ) {
            return '3' + value;
          }
          else if (new RegExp("^(\\[SETUP[^\\]]*\\])").test(value) ) {
            return '2' + value;
          }
          else {
            return '1' + value;
          }
        })
        // case insensitive sort
        .sort(function (a, b) {
          var x = a.toLowerCase(),
              y = b.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          if (a < b) { return -1; }
          if (a > b) { return 1; }
          return 0;
        })
        // remove sort priority prefix
        .map(function(value) { return value.replace(/^./, "") })
        // remove non-TAGS eg  [SECTION...  [0]  [a...  etc
        // and remove any already hard coded in tags object above
        .filter(function(value) {
          var newtag = true;
          if (new RegExp("^(\\[SECTION |\\[[^A-Z])").test(value) ) {
            newtag = false;
          }
          else {
            for (var i in tags) {
              tags[i].rx.lastIndex = 0;
              if (i == "SETUP" || i == "FF")  {
                // pick up these variations (as we only hardcoded them grouped)
                continue;
              }
              else if (tags[i].rx.test(value)) {
                // already included (hard coded in tags object above)
                newtag = false;
              }
            }
          }
          // keep in extraTags
          if (newtag) { return value }
        });

      // now include the extra tags for detection (add them to tags object)
      for (var i in extraTags) {
        var iv = extraTags[i].replace(/[\[\]]/g, "");
        var iv_encoded = encodeURIComponent(iv);
        tags[iv_encoded] = {
          'rx': new RegExp("(\\[" + RegExp.escape(iv) + "\\])", "gi"),
          're': "",
          'indicator': "*",
          'secflag': false,
          'subflag': false,
          'titleflag': false,
          'count': 0
        }
        if (new RegExp("^(SETUP|FF).+").test(iv)) {
          // remove the * indicator as these TAGS are in a group too
          tags[iv_encoded].indicator = "";
        }
      }

      var regexes = {
        'user_pref': {
          'rx':
            new RegExp(
            "^([ \t]*user_pref|.*//.*user_pref)"  // $1 user_pref  //user_pref  etc
            + "([ \t]*\\([ \t]*[\"'])"     // $2 ("  ('
            + "([^\"']+)"                  // $3 prefname
            + "([\"'][ \t]*,[ \t]*)"       // $4 ",  ',
            + "(.*)"                       // $5 prefvalue  "prefvalue"  'prefvalue'
            + "([ \t]*\\)[ \t]*;)"         // $6 );
            + "(.*)$", "gi"                // $7 afters/comment
            )
        },
        'http': {
          // linkify a/href for HTTP/HTTPS URLs
          'rx':
            new RegExp("(https?:[/][/][^ \"']+[^\\)\\], \"'.;])", "gi"),
          're':
            '<a target="_blank" rel="external noopener noreferrer" '
            + 'href="$1" class="http"><span class="hidden">__</span>$1</A>'
        }
      }

      ////////////////////////////////////////
      // start parsing (userjsTableView)
      ////////////////////////////////////////

      // convert in-block comments to in-line (for inactive pref recognition)
      var input_content = amendCodeComments(input_box.value, true)
        .replace(/(\r\n|\r)/g,'\n').split("\n");

      var prefArray = [];

      // create a first section heading
      prefArray.push( {
        'type': "section", 'title': "Introduction", 'desc': "",
        'id': "", 'name': "", 'state': "", 'value': "", 'comment': "",
        'info': "", 'tagclass': "HEADING "
      } );

      var ic = 0, x, r, line = "", linetype = "",
        prefid = "", prefid_prefix = "",
        prefName = "", prefState = "", prefValue = "",
        prefTitle = "", prefDesc = "", prefComment = "",
        prefCommentPlus = "", found,
        prefInfoSaved = true,  // add title+desc as own entry if not put on a pref
        ISawAParrot = -1, lastSection = 1,
        secMore = true, // we start in the first description
        subMore = false,
        titleMore = false,
        last_index = (prefArray.length - 1);

      for (ic in input_content) {
        line = input_content[ic];

        ////////////////////////////////////////
        // detect the type of line (userjsTableView)
        ////////////////////////////////////////

        // section/section+ sub/sub+ title/title+/user_pref prefComment+

        regexes["user_pref"].rx.lastIndex = 0;

        if ( (new RegExp("^// /\\*+[ \\t]*\\[SECTION[ \\t]*[^:]+:").test(line))
          || (new RegExp("^//[ *\t]*SECTION:").test(line))
        ) {
          // line starting  /*...  followed by [SECTION xxxx:
          // line starting  * SECTION:
          linetype = "section";
          lastSection++;
        }
        else if ( (new RegExp("^\/\/ /[*/]+ +(START|END|[0-9][^:]+):").test(line))
          || (new RegExp("^//[ *\t]*PREF:").test(line))
        ) {
          // line starting  /*... or //...  followed by  START: END: 1234: 1234a:
          linetype = "title";
        }
        else if (regexes["user_pref"].rx.test(line)) {
          linetype = "user_pref";
          secMore = false;
          subMore = false;
          titleMore = false;
        }
        else if (new RegExp("^// \\/[\\*\\/][ \t\\*\\/]*$").test(line)) {
          // line just  /* //
          continue;
        }
        else if (new RegExp("^// [ \\t]*\\*+\\/[ \\t]*$").test(line)) {
          // line just  */
          secMore = false;
          subMore = false;
          titleMore = false;
          continue;
        }
        else if (titleMore == true) {
          linetype = "title+"
        }
        else if (secMore == true) {
          linetype = "section+"
        }
        else if (subMore == true) {
          if (new RegExp("^// [ \\t]*\/\/[ \\t]*FF[0-9]+\\+*[ \\t]*$").test(line)) {
            // new 'sub' for: // FF99  (so tags from sub carried over)
            linetype = "ff"
          }
          else {
            linetype = "sub+"
          }
        }
        else if (/^[ \t]*$/.test(line)) {
          // ignore empty line (as we are not within a description)
          continue;
        }
        else if (new RegExp("^// [ \\t]*\/\/[ \\t]*FF[0-9]+\\+*[ \\t]*$").test(line)) {
          // new 'sub' for: // FF99  (so tags from sub carried over)
          linetype = "ff"
        }
        else if (new RegExp("^      //").test(line)) {
          linetype = "prefComment+"
        }
        else {
          linetype = "sub"
        }

        ////////////////////////////////////////
        // save unused prefTitle prefDesc (userjsTableView)
        ////////////////////////////////////////

        // (eg arkenfox/user.js 0105 0902 sub-sections have no user_pref)

        switch (linetype) {
          case "section":
          case "sub":
          case "ff":
          case "title":
            if (prefInfoSaved == false) {
              prefArray.push( {
                'type': "prefx", 'title': prefTitle, 'desc': prefDesc,
                'id': "" + prefid_prefix + prefid,
                'name': "", 'state': "", 'value': "", 'comment': "",
                'info': "", 'tagclass': ""
              } );
              last_index = (prefArray.length - 1);
              prefInfoSaved = true;
              // add to info
              for (var i in tags) {
                tags[i].rx.lastIndex = 0;
                if (
                  // (tags[i].secflag) ||    // ignore tags in section headings
                  (tags[i].subflag)
                  || (tags[i].titleflag)
                  || (tags[i].rx.test(prefArray[last_index].comment))
                ) {
                  if (tags[i].indicator) {
                    prefArray[last_index].info += tags[i].indicator + ' ';
                  }
                  prefArray[last_index].tagclass += "TAGS_" + i + " ";
                  tags[i].count++;
                }
              }
            }
        }

        ////////////////////////////////////////
        // reset some flags/variables (userjsTableView)
        ////////////////////////////////////////

        // (some are also reset in the line type detect above)

        switch (linetype) {
          case "section":
          case "sub":
          case "ff":
          case "title":
            prefTitle = "";
            prefDesc = "";
        }

        switch (linetype) {
          case "section":
            for (var i in tags) { tags[i].secflag = false; }
            for (var i in tags) { tags[i].subflag = false; }
            for (var i in tags) { tags[i].titleflag = false; }
            break;
          case "sub":
            for (var i in tags) { tags[i].subflag = false; }
            break;
          case "title":
            for (var i in tags) { tags[i].titleflag = false; }
            prefInfoSaved = false;
            break;
        }

        ////////////////////////////////////////
        // detect tags (userjsTableView)
        ////////////////////////////////////////

        switch (linetype) {
          case "section":
          case "section+":
            for (var i in tags) {
              tags[i].rx.lastIndex = 0;
              if (tags[i].rx.test(line)) { tags[i].secflag = true; };
            }
            break;
          case "sub":
          case "sub+":
            for (var i in tags) {
              tags[i].rx.lastIndex = 0;
              if (tags[i].rx.test(line)) { tags[i].subflag = true; };
            }
            break;
          case "title":
          case "title+":
            for (var i in tags) {
              tags[i].rx.lastIndex = 0;
              if (tags[i].rx.test(line)) { tags[i].titleflag = true; };
            }
            break;
        }

        ////////////////////////////////////////
        // escape the text (userjsTableView)
        ////////////////////////////////////////

        // replace & < > characters with HTML escape codes
        line = escapeHtml(line);

        ////////////////////////////////////////
        // capture pref id (arkenfox/user.js ref) (userjsTableView)
        ////////////////////////////////////////

        if (linetype == "section" || linetype == "title") {
          if (
            (new RegExp("^(?:\/\/ )/[*/]+[ \\t]+\\[SECTION ([^\\]]+)\\]:.*$").test(line))
            || (new RegExp("^(?:\/\/ )/[*/]+[ \\t]+([^:]+):.*$").test(line))
          ) {
            prefid = line;
            x = new RegExp("^(?:\/\/ )/[*/]+[ \\t]+\\[SECTION ([^\\]]+)\\]:.*$");
            prefid = prefid.replace(x, "$1");
            x = new RegExp("^(?:\/\/ )/[*/]+[ \\t]+([^:]+):.*$");
            prefid = prefid.replace(x, "$1");
            if (/^9999/.test(prefid)) {
              prefid_prefix = '9999:';
            }
            else if (/^END/.test(prefid)) {
              prefid_prefix = '';
            }
          }
        }

        ////////////////////////////////////////
        // style/linkify (userjsTableView)
        ////////////////////////////////////////

        // (pref done later as we only do //comment part)

        if (linetype != "user_pref") {
          regexes["http"].rx.lastIndex = 0;
          line = line.replace(regexes["http"].rx, regexes["http"].re);
          for (var i in tags) {
            if (tags[i].re) {
              tags[i].rx.lastIndex = 0;
              line = line.replace(tags[i].rx, tags[i].re);
            }
          }
        }

        ////////////////////////////////////////
        // section/section+/sub/sub+ (userjsTableView)
        ////////////////////////////////////////

        // heading (first line)
        if (linetype == "section" || linetype == "sub" || linetype == "ff") {
          prefArray.push( {
            'type': linetype.replace(/^ff$/, "sub"),
            'title':
              line.replace(/^\/\/ /, "")
                .replace(/^\/\*+[ \t]*/, "")
                .replace(/[ \t]*\*+\/[ \t]*$/, "")
                .replace(/^(\/\/ |   \/\/ |      \/\/ | \* |\* )/, ""),
            'desc': "", 'id': "",
            'name': "", 'state': "", 'value': "", 'comment': "",
            'info': "", 'tagclass': "HEADING "
          } );
          last_index = (prefArray.length - 1);

          // if line has a */ ending there will be no desc
          if (linetype == "section") {
            if (new RegExp("\\*\\*\\*\\/[ \\t]*$").test(line)) {
              secMore = false;
            }
            else {
              secMore = true;
            }
          }
          if (linetype == "ff") {
            subMore = false;
          }
          else {
            if (new RegExp("\\*\\*\\*\\/[ \\t]*$").test(line)) {
              subMore = false;
            }
            else {
              subMore = true;
            }
          }

        }

        // section+/sub+ (append to last saved entry in array)
        if (linetype == "section+" || linetype == "sub+") {
          prefArray[last_index].desc +=
            line.replace(/^\/\/ /, "")
              .replace(/^\/\*+[ \t]*/, "")
              .replace(/[ \t]*\*+\/[ \t]*$/, "")
              // .replace(/^(\/\/ |   \/\/ |      \/\/ | \* |\* )/, "")
            + "<br>";
        }

        // update info (tag indicators)
        switch (linetype) {
          case "section":
          case "section+":
            prefArray[last_index].info = "";
            for (var i in tags) {
              tags[i].rx.lastIndex = 0;
              if (tags[i].secflag) {
                if (tags[i].indicator) {
                  prefArray[last_index].info += tags[i].indicator + ' ';
                }
              }
            }
            break;
          case "sub":
          case "sub+":
            prefArray[last_index].info = "";
            for (var i in tags) {
              tags[i].rx.lastIndex = 0;
              if (tags[i].subflag) {
                if (tags[i].indicator) {
                  prefArray[last_index].info += tags[i].indicator + ' ';
                }
              }
            }
            break;
        }

        ////////////////////////////////////////
        // title / title+ (userjsTableView)
        ////////////////////////////////////////

        // title/title+ can apply to multiple prefs
        // (only stored in array when we get to user_pref on subsequent lines)

        // title (first line)
        if (linetype == "title") {
          prefTitle = line;
          x = new RegExp("^(?:\/\/ )/[*/]+ +[^:]+:[ \t]*(.*)[ \t]*$");
          prefTitle = prefTitle.replace(x, "$1")
            .replace(/^(\/\/ |   \/\/ |      \/\/ | \* |\* )/, "");
          x = new RegExp("[ \\t]*\\*+/[ \\t]*$");
          prefTitle = prefTitle.replace(x, "");
          x = new RegExp("[ \\t]*\\*+/[ \\t]*$");
          prefTitle = prefTitle.replace(x, "");
          prefTitle += "<br>"
          if (new RegExp("\\*\\*\\*\\/[ \\t]*$").test(line)) {
            titleMore = false;
          }
          else {
            titleMore = true;
          }
        }

        // title+
        if (linetype == "title+") {
          prefDesc += line.replace(/^\/\/ /, "");
            //.replace(/^(\/\/ |   \/\/ |      \/\/ | \* |\* )/, "");
          x = new RegExp("[ \\t]*\\*+/[ \\t]*$");
          prefDesc = prefDesc.replace(x, "");
          prefDesc += "<br>"
          if (new RegExp("\\*\\*\\*\\/[ \\t]*$").test(line)) {
            titleMore = false;
          }
          else {
            titleMore = true;
          }
        }

        ////////////////////////////////////////
        // pref (userjsTableView)
        ////////////////////////////////////////

        // (also store title/title+ collected from previous lines)

        if (linetype == "user_pref") {

          prefState = "";
          prefName = "";
          prefValue = "";
          prefComment = "";
          regexes["user_pref"].rx.lastIndex = 0;
          prefState = line.replace(regexes["user_pref"].rx, "$1");
          regexes["user_pref"].rx.lastIndex = 0;
          prefName = line.replace(regexes["user_pref"].rx, "$3");
          regexes["user_pref"].rx.lastIndex = 0;
          prefValue = line.replace(regexes["user_pref"].rx,"$5");
          // do not remove preceeding '//' (for output clarity later)
          regexes["user_pref"].rx.lastIndex = 0;
          prefComment = line
            .replace(regexes["user_pref"].rx, "$7")
            .replace(/^[ \t]*/, "");
            // .replace(/^(\/\/ |   \/\/ |      \/\/ | \* |\* )/, "");

          // determine if inactive
          if (new RegExp("^.*[/][/*].*user_pref", "i").test(prefState)) {
            prefState = "Inactive";
          }
          else {
            prefState = "";
          }

          // only display first instance of parrot pref
          if (prefName == "_user.js.parrot") {
            prefValue = ""; // clear parrot value
            if (ISawAParrot > -1) {
              // disabled: make first parrot display latest parrot value
              // prefArray[ISawAParrot].value = prefValue;
              continue;
            }
            // note index of first parrot (not yet appended)
            ISawAParrot = (prefArray.length);
          }

          // save to array
          prefArray.push( {
            'type': "user_pref", 'title': prefTitle, 'desc': prefDesc,
            'id': "" + prefid_prefix + prefid,
            'name': prefName, 'state': prefState, 'value': prefValue,
            'comment': prefComment, 'info': "",
            'tagclass': ((prefState) ? "TAGS_Inactive " : "TAGS_Active ")
          } );
          last_index = (prefArray.length - 1);

          // flag so we know prefTitle/prefDesc used
          // (those vars are not cleared as may be needed for next user_pref)
          prefInfoSaved = true;

          // create tag info/tagclass
          for (var i in tags) {
            tags[i].rx.lastIndex = 0;
            if (
              // (tags[i].secflag) ||    // ignore tags in section headings
              (tags[i].subflag)
              || (tags[i].titleflag)
              || (tags[i].rx.test(prefArray[last_index].comment))
            ) {
              if (tags[i].indicator) {
                prefArray[last_index].info += tags[i].indicator + ' ';
              }
              prefArray[last_index].tagclass += "TAGS_" + i + " ";
              tags[i].count++;
            }
          }

          // style/linkify comment
          regexes["http"].rx.lastIndex = 0;
          prefArray[last_index].comment = prefArray[last_index].comment
            .replace(regexes["http"].rx, regexes["http"].re);
          for (var i in tags) {
            tags[i].rx.lastIndex = 0;
            if (tags[i].re) {
              prefArray[last_index].comment = prefArray[last_index].comment
                .replace(tags[i].rx, tags[i].re);
            }
          }

        } // "user_pref"


        // prefComment+
        if (linetype == "prefComment+") {

          prefCommentPlus = "";
          prefCommentPlus = line.replace(/^[ \t]*/, "");

          // refresh tag info and add to tagclass/count
          prefArray[last_index].info = "";
          for (var i in tags) {
            var tagclasstext = "TAGS_" + i + " ";
            var alreadyintagclass = new RegExp(tagclasstext)
              .test(prefArray[last_index].tagclass);
            tags[i].rx.lastIndex = 0;
            if ( (alreadyintagclass) || (tags[i].rx.test(prefCommentPlus)) ) {
              if (tags[i].indicator) {
                prefArray[last_index].info += tags[i].indicator + ' ';
              }
              if (!alreadyintagclass) {
                prefArray[last_index].tagclass += tagclasstext;
                tags[i].count++;
              }
            }
          }

          // style/linkify prefCommentPlus
          regexes["http"].rx.lastIndex = 0;
          prefCommentPlus = prefCommentPlus
            .replace(regexes["http"].rx, regexes["http"].re);
          for (var i in tags) {
            tags[i].rx.lastIndex = 0;
            if (tags[i].re) {
              prefCommentPlus = prefCommentPlus
                .replace(tags[i].rx, tags[i].re);
            }
          }

          prefArray[last_index].comment += "<br>" + prefCommentPlus;

        }

        ////////////////////////////////////////
        ////////////////////////////////////////

      }
      input_content = [];
      lastSection++;

      ////////////////////////////////////////
      // end of parsing (userjsTableView)
      ////////////////////////////////////////


      ////////////////////////////////////////
      // calculate: stats (userjsTableView)
      ////////////////////////////////////////

      var stats = {
        'total': { 'id': -2, 'sub': false, 'count': 0, 'name': "Total" },
        'totala': { 'id': -2, 'sub': true,  'count': 0, 'name': "Active" },
        'totali': { 'id': -2, 'sub': true,  'count': 0, 'name': "Inactive" },
      }

      var statBase = "", statSuffix = "";
      for (var i = 0, len = prefArray.length; i < len; i++) {
        if (prefArray[i].type == "user_pref") {
          if (prefArray[i].state == '') {
            stats["total"].count++;
            stats["totala"].count++;
          }
          else {
            stats["total"].count++;
            stats["totali"].count++;
          }
        }
      }


      ////////////////////////////////////////
      // start forming HTML (userjsTableView)
      ////////////////////////////////////////

      var content_html =
          '<div id="tableview_buttons_bar"><div>'
        + '<span id="tableview_heading" class="body_' + theme + '">';

      // title eg arkenfox user.js (date) (version)
      if (/^[ \t\\\*]*name[ \t:]*(.*)[ \t]*$/m.test(input_box.value)) {
        content_html += '<h3 style="padding: 0px; margin: 0px; display:inline;">' +
          (/^[ \t\\\*]*name[ \t:]*(.*)[ \t]*$/m.exec(input_box.value)[1])
          + '</h3>&nbsp;'
      }
      if (/^[ \t\\\*]*date[ \t:]*(.*)[ \t]*$/m.test(input_box.value)) {
        content_html += "("
          + (/^[ \t\\\*]*date[ \t:]*(.*)[ \t]*$/m.exec(input_box.value)[1])
          + ")&nbsp;";
      }
      if (/^[ \t\\\*]*(version.*)[ \t]*$/m.test(input_box.value)) {
        content_html += "("
          + (/^[ \t\\\*]*(version.*)[ \t]*$/m.exec(input_box.value)[1])
          + ")";
      }

      content_html +=

        '<br></span></div><div style="float:left;width:100%;">'

        // collapse all button
        + '<button type="button" style="width:2em;" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="collapse_button" onclick="userjsTableViewCollapseAll();"'
        + ' title="Collapse All Descriptions"><b>-</b></button>'

        // expand all button
        + '<button type="button" style="width:2em;" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="expand_button" onclick="userjsTableViewExpandPrefDesc();"'
        + ' ondblclick="userjsTableViewExpandAll();"'
        + ' title="Expand All Descriptions (single/double click)"><b>+</b></button>'

        // expand_collapse button (hidden except in afmode)
        + '<button type="button" style="display:none;" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + ' afmode_button" id="expand_collapse_button" onclick="userjsTableViewExpandCollapseAll();"'
        + ' title="Expand/Collapse Descriptions"><b>+</b><span class="button_text"> Expand</span></button>'

        // filter button select
        + '<select class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + ' afmode_button" id="filter_select" onchange="userjsTableViewTagFilter();" '
        + 'title="Filter tags/text">'
        + '  <option value="" disabled selected hidden>&#x25BE;&#x00A0;&#x25A2;&#x00A0;Filter</option>'
        + '  <option value="SHOWALL">Show all (clear filter)'
        + '&#x00A0;&#x00A0;&#x00A0;&#x00A0;(' + stats["total"].count + ')</option>'
        + '  <option value="HIDEHEADINGS">&#x25A2;&#x00A0;&#x00A0;Hide headings</option>'
        + '  <option value="HIDEINACTIVE">&#x25A2;&#x00A0;&#x00A0;Hide inactive</option>'
        + '  <option value="HIDEACTIVE">&#x25A2;&#x00A0;&#x00A0;Hide active</option>'
        + '  <option value="INVERT">&#x25A2;&#x00A0;&#x00A0;Invert (show the opposite)</option>'
        + '  <option value="SEARCH">&#x25A2;&#x00A0;&#x00A0;&#x1f50d;'
        + ' Search&#x00A0;(0;0)&#x00A0;</option>'
        // + '  <option disabled></option>'
        + '  <option value="TAGS_Active">&#x25A2;&#x00A0;&#x00A0;'
        + 'Active'
        + '&#x00A0;&#x00A0;&#x00A0;&#x00A0;(' + stats["totala"].count + ')</option>'
        + '  <option value="TAGS_Inactive">&#x25A2;&#x00A0;&#x00A0;'
        + 'Inactive'
        + '&#x00A0;&#x00A0;&#x00A0;&#x00A0;(' + stats["totali"].count + ')</option>';

      // add tags to filter select (and show indicator/key plus counts)
      for (var i in tags) {
        if (tags[i].count > 0) {
          content_html += '  <option value="' + "TAGS_" + i
            + '">&#x25A2;&#x00A0;&#x00A0;';
          if (tags[i].indicator) {
            content_html += tags[i].indicator
              + '&#x00A0;&#x00A0;-&#x00A0;&#x00A0;';
          }
          content_html +=
            ((tags[i].option_name) ? tags[i].option_name : decodeURIComponent(i))
            + '&#x00A0;&#x00A0;&#x00A0;&#x00A0;('
            + tags[i].count + ')</option>';
        }
      }

      content_html +=
          '</select>'

        // search input box (hidden except in afmode)
        + '<input id="tview_search_input" type="text" value="" '
        + 'placeholder=" &#x1f50d; Search (RegExp)"  class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" style="display:none;text-align:left;height:1.8em;" />'

        // search clear button (hidden except in afmode)
        + '<button type="button" id="search_clear_button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" title="Clear search" style="display:none;height:2em;"'
        + '>&nbsp;&#x274C;&nbsp;</button>'

        // ref: http://www.amp-what.com/unicode/search/triangle
        // navigation: jumpback_button
        + '<button type="button" id="jumpback_button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" style="width:2em;" title="Jump back a section">&#9650;</button>'
        // navigation: jumpnext_button
        + '<button type="button" id="jumpnext_button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" style="width:2em;margin-right:0.5em;" '
        + 'title="Jump to next section">&#9660;</button>'
        // navigation: viewer_slider
        + '<input type="range" min="0" max="50" value="0" id="viewer_slider">'

        // about button (hidden except in afmode)
        + '<button type="button" id="about_button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + ' afmode_button" title="About" style="display:none;float:right;height:2em;"'
        + '><span class="">&#8505;</span><span class="button_text"> About</span></button>'

        // version button (hidden except in afmode)
        + '<div id="version_button" class="vcentertext"'
        + '" style="display:none;float:right;height:2em;"><b>'

      // version
      if (/^[ \t\\\*]*(version.*)[ \t]*$/m.test(input_box.value)) {
        content_html += "v"+(/^[ \t\\\*]*version[: \t]*(.*)[ \t]*$/m.exec(input_box.value)[1]);
      }

      content_html +=
         '</b></div></div>'

        + '<div id="afgui_about" class="borders' + ' borders_' + theme
        + ' style="display:none;'
        + 'padding:1em 0;overflow-wrap:anywhere;word-break:normal;white-space:normal"'
        + '><div id="afgui_about_insert"></div><br>'
        + '<button type="button" id="afgui_about_close_button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + ' afmode_button" style="float:right;height:2em;"'
        + ' onclick=document.getElementById("afgui_about").style.display="none";'
        + '>Close</button>'
        + '</div></div>'

        + '<div style="width: 100%;" id="tableview_div">'
        + '<div id="tableview_offset"><br><br><br><br></div>\n';

      var index_select_html = ''
        + '<option value="" disabled selected hidden>&#x25BE;Index</option>\n'
        + '<option value="0">(TOP)</option>\n';

      var groups_container_html =
        '<a target="_blank" href="" id="group_link_showing_table_filter">-'
        + 'Current Table View (changes with [Filter] button use)'
        + '</a><br>\n';


      ////////////////////////////////////////
      // build results table (userjsTableView)
      ////////////////////////////////////////

      // loop through array and build each table row
      // (either: section heading or user_pref rows)

      content_html += '<table id="table_tview">'

      content_html +=
          '<tr>'
        + '<td class="td_tview_all td_tview_id">ID</td>'
        + '<td class="td_tview_all td_hide"> </td>'
        + '<td class="td_tview_all td_tview_name">Preference Name</td>'
        + '<td class="td_tview_all td_hide"> </td>'
        + '<td class="td_tview_all td_tview_value">Value</td>'
        + '<td class="td_tview_all td_hide"> </td>'
        + '<td class="td_tview_all td_tview_desc">Description</td>'
        + '<td class="td_tview_all td_hide"> </td>'
        + '<td class="td_tview_all td_tview_info">Info</td>'
        + '</tr>';

      var section_heading = "";
      var sectionCount = 0;
      var group_user_pref_list = '';
      var group_user_pref_list_filter = '';

      for (var i = 0, len = prefArray.length; i < len; i++) {

        if (prefArray[i].type == "section") {

          // section heading row (but not for sub-heading)

          sectionCount++;
          content_html +=
              '<tr class="tr_tview_heading '
            + prefArray[i].tagclass + '">'
            + '<td class="td_tview_all" colspan="4">'
            // anchor
            + '<span class="anchor" id="' + sectionCount + '"></span>'
            // section heading
            + ((prefArray[i].desc=="") ? ""
              : '<details class="det secDet"><summary>')
            + '<span class="pref">'
            + prefArray[i].title + '</span>'
            + ((prefArray[i].desc=="") ? "" : "</summary><br>")
            + prefArray[i].desc
            + ((prefArray[i].desc=="") ? "" : "</details>")
            + '</td>'
            // pref info (state etc)
            + '<td class="td_tview_all td_hide"> </td>'
            + '<td class="td_tview_all td_tview_info">'
            + prefArray[i].info
              .replace(new RegExp('<span class="setup">S</span> '
                + '(<span class="setup">S.</span>)'), "$1")
            + '</td></tr>';

          // end and start about:config bookmarks groups
          if (sectionCount > 1) {
            group_user_pref_list = group_user_pref_list.replace(/\|$/, '');
            groups_container_html += group_user_pref_list + ')(;|$)|^$/i">-'
              + section_heading + '</a><br>\n';
            group_user_pref_list = '';
          }
          groups_container_html +=
            '<a target="_blank" href="about:config?filter=/^\\*$|^(';
          // note current section_heading for next time
          section_heading = prefArray[i].title;
          // add to index_select button
          index_select_html += '<option value=' + sectionCount
            + '>' + section_heading + '</option>\n';

        }
        else {

          // user_pref and sub-heading row
          // (note: sub-headings are flagged in their prefArray[i].tagclass)

          content_html +=
              '<tr class="tr_tview_pref '

            // class for inactive user_pref
            + ((prefArray[i].state=="") ? "" : "tr_tview_inactive ")
            + prefArray[i].tagclass + '">'

            // pref id (arkenfox/user.js ref)
            + '<td class="td_tview_all td_tview_id">'
            + '<span class="ref">' + prefArray[i].id.replace(":", "<br>")
            + '</span></td>'

            // pref name
            + '<td class="td_tview_all td_hide"> </td>'
            + '<td class="td_tview_all td_tview_name">'
            + "<a target=\"_blank\" href=\"about:config?filter=/^\\*\$|^("
            + prefArray[i].name.replace(/([*.+])/g, "\\$1")
            + ")(;|\$)|^\$/i\">" + prefArray[i].name + "</a>"
            + '</td>'

            // pref value (add class for color)
            + '<td class="td_tview_all td_hide"> </td>'
            + '<td class="td_tview_all td_tview_value">'
            + '<span class="' + prefArray[i].value
                .replace(/^[0-9.+-]+$/, "integer")
                .replace(/^(".*"|'.*')$/, "string")
            + '">' + prefArray[i].value + '</span></td>'

            // pref desc (title+desc+comment) (details tag)
            + '<td class="td_tview_all td_hide"> </td>'
            + '<td class="td_tview_all td_tview_desc">'
              // only use details tag if we have desc or comment
            + ( ((prefArray[i].desc=="" && prefArray[i].comment=="")
                || (prefArray[i].title=="" && prefArray[i].desc=="") ) ? ""
              : '<details class="det prefDet"><summary>')
            // title
            + ((prefArray[i].type == "sub")
                ? '<span class="pref" style="font-weight: normal">'
                : '<span class="ref" style="font-weight: normal">')
            + prefArray[i].title + '</span>'
            // close the summary (if used)
            + ( ((prefArray[i].desc=="" && prefArray[i].comment=="")
                || (prefArray[i].title=="" && prefArray[i].desc=="") ) ? ""
              : "</summary>")
            // desc + comment
            + prefArray[i].desc + prefArray[i].comment
            // close the details (if used)
            + ( ((prefArray[i].desc=="" && prefArray[i].comment=="")
                || (prefArray[i].title=="" && prefArray[i].desc=="") ) ? ""
              : "</details>")
            + '</td>'

            // pref info (state etc)
            + '<td class="td_tview_all td_hide"> </td>'
            + '<td class="td_tview_all td_tview_info">'
            + ((prefArray[i].state=="") ? ""
              : '<span class="pref">' + prefArray[i].state + '</span><br>')
            + prefArray[i].info
              .replace(new RegExp('<span class="setup">S</span> '
                + '(<span class="setup">S.</span>)'), "$1")
            + '</td></tr>';

            // collect prefname for pref groups
            if (prefArray[i].name) {
              group_user_pref_list +=
                prefArray[i].name.replace(/([*.+])/g, "\\$1") + "|";
              group_user_pref_list_filter +=
                prefArray[i].name.replace(/([*.+])/g, "\\$1") + "|";
            }
        }

      }
      content_html += '</table>';
      // bottom anchor
      sectionCount++;
      content_html += '<span class="anchor" id="' + sectionCount + '"></span>';
      index_select_html += '<option value="' + sectionCount
        + '">(BOTTOM)</option>\n';

      // end about:config bookmarks groups
      group_user_pref_list = group_user_pref_list.replace(/\|$/, '');
      groups_container_html += group_user_pref_list + ')(;|$)|^$/i">-'
        + section_heading + '</A><br>\n';

      ////////////////////////////////////////
      // end content and add into document (userjsTableView)
      ////////////////////////////////////////

      content_html += '</div><br><br><br><br>\n';
      document.getElementById("view_area").innerHTML = content_html;
      document.getElementById("index_select").innerHTML = index_select_html;

      if (!!(document.getElementById("groups_container"))) {
        // also remove first group if unused
        document.getElementById("groups_container").innerHTML =
          groups_container_html.replace(new RegExp('<a target="_blank"'
            + ' href="about:config\\?filter='
            + '\\/\\^\\\\\\*\\$\\|\\^\\(\\)\\(;\\|\\$\\)\\|\\^\\$\\/i">'
            + '-Introduction<\\/A><br>'), "");
      }

      if(!!(document.getElementById("group_link_showing_table_filter"))) {
        document.getElementById("group_link_showing_table_filter").href =
          'about:config?filter=/^\\*$|^('
          + group_user_pref_list_filter.replace(/\|$/, '')
          + ')(;|$)|^$/i';
      }

      content_html = null;
      index_select_html = null;
      groups_container_html = null;

      // back
      document.getElementById("jumpback_button").addEventListener("click", function() {
        var e = document.getElementsByClassName("anchor");
        var id = 0;
        for (var i = 0, j = e.length; i<j; i++) {
          if (e[i].getBoundingClientRect().y >= 0) {
            break;
          }
          else {
            id = i + 1;
          }
        }
        document.getElementById("viewer_slider").value = id;
        if (id == 0) {
          scroll(0,0);
        }
        else {
          document.getElementById(id).scrollIntoView();
        }
      });

      // next
      document.getElementById("jumpnext_button").addEventListener("click", function() {
        var e = document.getElementsByClassName("anchor");
        var id = 1;
        for (var i = 0, j = e.length; i<j; i++) {
          if (e[i].getBoundingClientRect().y > 1) {
            break;
          }
          else {
            id = i + 2;
          }
        }
        document.getElementById("viewer_slider").value = id;
        if (id == 0) {
          scroll(0,0);
        }
        else {
          document.getElementById(id).scrollIntoView();
        }
      });

      // nav slider usage jump to position
      document.getElementById("viewer_slider").max = sectionCount;
      for (const event of [ "input", "click" ]) {
        document.getElementById("viewer_slider").addEventListener(event, function() {
          if (this.value == 0) {
            scroll(0,0);
          }
          else {
            document.getElementById(this.value).scrollIntoView();
          }
        });
      }

      // refresh as per UI settings
      if (typeof togglePrefixAboutConfigLinks === "function") { 
        togglePrefixAboutConfigLinks("refresh");
      }
      if (typeof toggleExpandAllOnView === "function") { 
        if (toggleExpandAllOnView("status")) { userjsTableViewExpandAll(true); }
      }
      if (filter_search) {
        document.getElementById("tview_search_input").value=filter_search;
      }
      if ( (filter_tag) || (filter_search) ) {
        userjsTableViewTagFilter(filter_tag,filter_search);
      }
      if (typeof toggleGroupsOnView === "function") { 
        if (toggleGroupsOnView("status")) { toggleGroupsPanel(true); }
      }
      if (typeof arkenfoxRepoMode != "undefined") {
        if (arkenfoxRepoMode) {
          userjsTableViewWhenArkenfoxRepoMode(theme);
        }
      }

    } /* end function userjsTableView */
