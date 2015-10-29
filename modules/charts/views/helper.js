function test_first_load() {
    chrome.storage.sync.get('data', function(result)
    {
        try {
            data = result.data;
        }
        catch(err) {
            return err;
        }

        if (typeof data == 'undefined') {
            //alert('ta undefined');
            //alert('primeira carga');
            storage_first_save();
        }
        //alert('ja tem');
        //alert(data);
        data = JSON.parse(data);
        //alert(data);
        return data;
    });
}

function storage_first_save() {
    data  = JSON.stringify(
        {
            "mail.google": {
                "productivity": "Neutral",
                "category": "Communication"
            },
            "facebook": {
                "productivity": "Unproductive",
                "category": "Social Networking"
            },
            "overleaf": {
                "productivity": "Productive",
                "category": "Learning"
            },
            "filmesonlinegratis": {
                "productivity": "Unproductive",
                "category": "Entertainment"
            },
            "youtube": {
                "productivity": "Unproductive",
                "category": "Entertainment"
            },
            "javascript.info": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "google": {
                "productivity": "Neutral",
                "category": "Search"
            },
            "stackoverflow": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "groups.google": {
                "productivity": "Productive",
                "category": "Communication"
            },
            "htmlgoodies": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "coderanch": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "developer.mozilla": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "accounts.google": {
                "productivity": "Neutral",
                "category": "Uncategorized"
            },
            "w3schools": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "msdn.microsoft": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "pt.stackoverflow": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "translate.google": {
                "productivity": "Productive",
                "category": "Languages"
            },
            "egghead.io": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "dashingd3js": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "bl.ocks": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "bost.ocks": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "mbostock.github.io": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "alignedleft": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "canalviva.globo": {
                "productivity": "Unproductive",
                "category": "Entertainment"
            },
            "globo": {
                "productivity": "Unproductive",
                "category": "News & Opinion"
            },
            "kevintcoughlin": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "christopheviau": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "strongriley.github.io": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "github": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "d3js": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "whiplash": {
                "productivity": "Unproductive",
                "category": "News & Opinion"
            },
            "pt.wikipedia": {
                "productivity": "Productive",
                "category": "Learning"
            },
            "ironsummitmedia.github.io": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "startbootstrap": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "getbootstrap": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "codefixer": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "css-tricks": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "programmers.stackexchange": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "developer.chrome": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "jquery": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "nytimes": {
                "productivity": "Neutral",
                "category": "News & Opinion"
            },
            "advancesharp": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "docs.oracle": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "codeproject": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "codingforums": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "codepen.io": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "viralpatel": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "jsfiddle": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "devmedia": {
                "productivity": "Productive",
                "category": "Software Development"
            },
            "exame.abril": {
                "productivity": "Unproductive",
                "category": "unclassified"
            },
            "linkedin": {
                "productivity": "Unproductive",
                "category": "Social Networking"
            },
            "br.linkedin": {
                "productivity": "Unproductive",
                "category": "Social Networking"
            }
        }
    );
    //alert(data);

    chrome.storage.sync.set({'data': data}, function() {
        // Notify that we saved.
        //message('Settings saved');
        //alert('Settings saved');
        //
        //chrome.storage.sync.get('data', function (result) {
        //    data = result.data;
        //    alert(typeof data);
        //    data = JSON.parse(data);
        //    alert(typeof data);
        //    alert(dump(data));
        //
        //});
    });
}



function save_to_storage(key, data) {
    chrome.storage.sync.set({'data': data}, function() {
        // Notify that we saved.
        //alert('Settings saved');
    });
}

function load_from_storage() {
    chrome.storage.sync.get('data', function(result)
    {
        try {
            data = result.data;
            //alert(data);
        }
        catch(err) {
            return 'key empty';
        }

        data = JSON.parse(data);
        return data;
    });
}