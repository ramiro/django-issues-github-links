//
// Some commits to test this snippet:
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

var needle = /((?:refs\.?|fixe[ds])\s+)#(\d+)/gi;
// Example of a link we need to replace:
// <a class="issue-link js-issue-link tooltipped tooltipped-ne" data-error-text="Failed to load issue title" data-id="53897017" data-permission-text="Issue title is private" data-hovercard-type="pull_request" data-hovercard-url="/django/django/pull/3871/hovercard" href="https://github.com/django/django/pull/3871" aria-label="#3871, Non digits custom user model primary key password lookup.">#3871</a>
var github_pr_link = /((?:refs\.?|fixe[ds])\s+)(?:<a class="issue-link js-issue-link[^>]+?>)#(\d+)(?:<\/a>)/gi;
var selectors = [
  // for
  // https://github.com/django/django/commit/* and
  // https://github.com/django/django/pull/*/commits/*
  "p.commit-title",
  "div.commit-desc",
  // for https://github.com/django/django/pull/*
  "span.js-issue-title"
];

function replacer(match, prefix, trac_ticket, offset, haystack) {
  return `${prefix}<a class=django-trac-link href=https://code.djangoproject.com/ticket/${trac_ticket}>#${trac_ticket}</a>`;
}

for (var sel of selectors) {
  var elements = document.querySelectorAll(sel);
  elements.forEach(function(e) {
    var innerHtml = e.innerHTML.replace(needle, replacer);
    e.innerHTML = innerHtml.replace(github_pr_link, replacer);
  });
}
