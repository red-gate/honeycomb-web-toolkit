<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Honeycomb web toolkit class name cheatsheet</title>
        <link rel="stylesheet" href="https://cdn.rd.gt/honeycomb-web-toolkit/10.0.0/honeycomb.css"/>
    </head>
    <body>
        <div class="band">
            <div class="band__inner-container">
                <h1>Honeycomb web toolkit class name cheatsheet</h1>

                <ul>
                {{#each rules}}
                    <li>{{rule}}</li>

                    {{#if children}}<ul>{{/if}}
                    {{#each children}}
                        <li>{{rule}}</li>
                    {{/each}}

                    {{#if children}}</ul>{{/if}}
                {{/each}}
                </ul>
            </div>
        </div>
    </body>
</html>