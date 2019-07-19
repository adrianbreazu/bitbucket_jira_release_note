let btn_generate = document.getElementById('btn-generate');
var input_latest_records_element = document.getElementById('latest-records');


btn_generate.onclick = function(element) {
    var value = input_latest_records_element.value;

    function extractDOM(input_latest_records) {
        let json_data = {}
        var data_commit = document.querySelectorAll('tr.commit-row');
        var array_data = [];
        var data_dict = {};
        var obj = {};
        var number_of_records = 0;

        if (typeof(input_latest_records) !== 'undefined' && input_latest_records > 0)
            number_of_records = input_latest_records;
        else
            number_of_records = data_commit.length;
        for (var i = 0; i < number_of_records; i++) {
            //reset array data and obj
            array_data = [];
            obj = {};

            //extract issue key
            var issue_key = data_commit[i].querySelector('td.commit-list-jira-issues-col');
            issue_key = data_commit[i].querySelector('td.commit-list-jira-issues-col').querySelector('a').dataset.issueKeys;

            // extract href and text
            var commit_text = data_commit[i].querySelector('td.message');
            // see if message-body is populated else read from messge-subject
            var element = commit_text.querySelector('span.message-body').lastChild;
            if (typeof(element) != 'undefined' && element != null)
                commit_text = commit_text.querySelector('span.message-body').lastChild;
            else
                commit_text = commit_text.querySelector('span.message-subject').lastChild;
            var href = commit_text.href;
            commit_text = commit_text.innerHTML;
            //create commit object
            obj['href'] = href;
            obj['text'] = commit_text;

            //populate data dict with data
            if (issue_key in data_dict)
                array_data = data_dict[issue_key];
            array_data.push(obj);
            data_dict[issue_key] = array_data;
        }
        return JSON.stringify(data_dict);
    };

    chrome.tabs.executeScript({
        code: '(' + extractDOM + ')(' + value + ');'
    }, function(results) {
        var json_received = results[0];
        var json_obj = JSON.parse(json_received);

        var ol = document.createElement('ol');
        for (data in json_obj) {
            var ol_li = document.createElement('li');
            ol_li.innerHTML = data;
            var ul = document.createElement('ul');

            for (var i = 0; i < json_obj[data].length; i++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerHTML = json_obj[data][i]['text'];
                a.href = json_obj[data][i]['href'];
                li.appendChild(a);
                ul.appendChild(li);
            }
            ol_li.appendChild(ul);
            ol.appendChild(ol_li);
        }
        document.querySelector('#list-items').appendChild(ol);
    });
}
