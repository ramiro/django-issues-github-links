//
// Some links to test this snippet:
//
// https://github.com/django/django/commit/3f8ee58ccc5c55e62625ad797ddde05778fe1bec
// https://github.com/django/django/commit/6201141b2ccfc54874cb43158daae0efd49afa23
// https://github.com/django/django/commit/21e559495b8255bba1e8a4429cd083246ab90457
// https://github.com/django/django/commit/1ed9b9e2e2b62f6ef89558f98d786e9fcd649152
// https://github.com/django/django/commit/17c3997f6828e88e4646071a8187c1318b65597d
// https://github.com/django/django/commit/3a505c70e7b228bf1212c067a8f38271ca86ce09
// https://github.com/django/django/commit/894cb13779e6d092974c873bd2cf1452554d2e06
// https://github.com/django/django/pull/11732
// https://github.com/django/django/pull/11735

var sentinel_re = /((refs\.?|fixe[ds]))(?=\s+#\d+)/gi;
var ticket_re = /^(,?\s+)#(\d+)/g;
// Example of a link we need to replace:
// <a class="issue-link js-issue-link tooltipped tooltipped-ne" data-error-text="Failed to load issue title" data-id="53897017" data-permission-text="Issue title is private" data-hovercard-type="pull_request" data-hovercard-url="/django/django/pull/3871/hovercard" href="https://github.com/django/django/pull/3871" aria-label="#3871, Non digits custom user model primary key password lookup.">#3871</a>
var github_pr_link_re = /((?:refs\.?|fixe[ds])\s+)(?:<a class="issue-link js-issue-link[^>]+?>)#(\d+)(?:<\/a>)/gi;
var selectors = [
  // for
  // https://github.com/django/django/commit/* and
  // https://github.com/django/django/pull/*/commits/*
  "p.commit-title",
  "div.commit-desc",
  // for https://github.com/django/django/pull/*
  "span.js-issue-title"
];

function pr_remover(match, prefix, trac_ticket, offset, haystack) {
  return `${prefix}#${trac_ticket}`;
}

function replacer(match, prefix, trac_ticket, offset, haystack) {
  return `${prefix}<a class=django-trac-link href=https://code.djangoproject.com/ticket/${trac_ticket}>#${trac_ticket}</a>`;
}

for (var sel of selectors) {
  var elements = document.querySelectorAll(sel);
  elements.forEach(function(e) {
    var innerHtml = e.innerHTML;
    var work2 = innerHtml.replace(github_pr_link_re, pr_remover);
    innerHtml = innerHtml.replace(github_pr_link_re, pr_remover);
    console.log('level 1: element HTML: "' + innerHtml + '"');
    //var result = innerHtml;
    //while (sentinel_re.exec(innerHtml)) {
    while (sentinel_re.exec(work2)) {
      var sentinel_lastidx = sentinel_re.lastIndex;
      console.log('\t\tlevel 2: lastIndex: ' + sentinel_lastidx);
      //var preamble = innerHtml.slice(0, sentinel_lastidx);
      var preamble = work2.slice(0, sentinel_lastidx);
      console.log('\tlevel 2: preamble: "' + preamble + '"');
      //var body = innerHtml.slice(sentinel_lastidx);
      var body = work2.slice(sentinel_lastidx);
      console.log('\tlevel 2: body: "' + body + '"');
      //var work = innerHtml.slice(sentinel_lastidx);
      var work = work2.slice(sentinel_lastidx);
      var result = preamble;
      //result = preamble;
      var end_marker = 0;
      while (ticket_re.test(work)) {
        var lastIndex = ticket_re.lastIndex;
        console.log('\t\tlevel 3: lastIndex: ' + lastIndex);
        //var fragment = work.slice(0, lastIndex);
        //fragment = fragment.replace(ticket_re, replacer);
        var fragment = work.slice(0, lastIndex).replace(ticket_re, replacer);
        console.log('\t\tlevel 3: fragment: "' + fragment + '"');
        result += fragment;
        end_marker += lastIndex;
        work = work.slice(lastIndex);
        console.log('\t\tlevel 3: work: "' + work + '"');
      }
      //result += body.slice(end_marker);
      result += work2.slice(end_marker);
      console.log('\tlevel 2 (post): result: "' + result + '"');
      //console.log('\tlevel 2 (post): remaining: "' + innerHtml.slice(sentinel_re.lastIndex) + '"');
      work2 = work2.slice(lastIndex);
      sentinel_re.lastIndex = 0;
    }
    //e.innerHTML = innerHtml;
    e.innerHTML = result;
  });
}

function processTicketToken(ticketRegexp, work, result) {
  var lastIndex = ticketRegexp.lastIndex;
  console.log('\t\tlevel 3: lastIndex: ' + lastIndex);
  //var fragment = work.slice(0, lastIndex);
  //fragment = fragment.replace(ticketRegexp, replacer);
  var fragment = work.slice(0, lastIndex).replace(ticketRegexp, replacer);
  console.log('\t\tlevel 3: fragment: "' + fragment + '"');
  result += fragment;
  end_marker += lastIndex;
  work = work.slice(lastIndex);
  console.log('\t\tlevel 3: work: "' + work + '"');
}
