# Honeycomb

## Introduction
Honeycomb is the Web team's approach at providing consistent code, design and components across Redgate's web based projects/products.

Honeycomb is designed to be the core foundation for a web project to be built from. Website developers then build their web project using, and building upon, the building blocks and components that Honeycomb provides.

## Modules
The building blocks and components have been separated into modules, to make it easier to maintain and separate concerns. Each module has a README that explains what the module is for, and the module dependencies it has.

## NPM
Honeycomb is packaged as an NPM package, and therefore can be distributed across projects using the Node package manager (NPM).

This allows the project to be separated, managed and distributed easily, and allows developers to easily update their projects to the latest, or specific version, of Honeycomb.

## Getting Honeycomb into your project

### Use the pre-compiled version
Grab the <code>dist</code> directory from the repo, and add it to your project.

#### CSS
Reference the compiled CSS in the head of your HTML document(s), e.g. 
<code>\<link rel="stylesheet" href="/assets/honeycomb/honeycomb.css"></code>

#### JavaScript
If you're planning on using the JavaScript elements of Honeycomb, then you'll need to reference the compiled, minified JavaScript from your project, e.g. <code><script src="/assets/honeycomb/honeycomb.min.js"></code>.

You'll also need to create a Honeycomb object, setting the path to your Honeycomb directory, so that the JavaScript can lazy load some of the vendor scripts it needs.

<pre><code>window.Honeycomb = {
    'path': '/assets/honeycomb/'
};
</code></pre>

### Build from source
Firstly, make sure you've installed Node and NPM.

Then, simply run 
<code>npm install git://github.com/red-gate/honeycomb-web-toolkit.git</code> 
to get the latest version. 

You can apply a version number to the end if you want a specific version, e.g. 
<code>npm install git://github.com/red-gate/honeycomb-web-toolkit.git#v1.2.3</code>.

This will add Honeycomb to your <code>node_modules</code> directory, where you can reference the Sass modules from.

## Setting up a local dev environment

To work on the Honeycomb web toolkit locally, you'll need Node and NPM. 

You'll also need a webserver configured to parse Server Side Includes in `.htm` files. 

### Setting up Server Side Includes in Apache

In `apache/conf/httpd.conf`, find `<IfModule mime_module>`.

Within that module you should find some lines about server-side includes:

    ```
    # To parse .shtml files for server-side includes (SSI):
    # (You will also need to add "Includes" to the "Options" directive.)
    AddType text/html .shtml
    AddOutputFilter INCLUDES .shtml
    ```

Add ` .htm` after both instances of `.shtml`, so the new rule looks like this:

    ```
    # To parse .shtml files for server-side includes (SSI):
    # (You will also need to add "Includes" to the "Options" directive.)
    AddType text/html .shtml .htm
    AddOutputFilter INCLUDES .shtml .htm
    ```
    
Restart Apache.
    
### Setting up Server Side Includes in IIS

In IIS Manager, go to your Honeycomb Web Toolkit site (or set one up). 

Open Handler Mappings. 

Click **Add Module Mapping...**

Configure the new module:

```
Request path: *.htm
Module: ServerSideIncludeModule
Name: SSINC-htm
```
    
Click OK and restart IIS. 

### Building and serving the honeycomb dev site

Once your webserver is configured, point it at the `/` directory in the honeycomb web toolkit repository, start the webserver, and point your browser at the `/docs` directory. 

Build the toolkit:
`
npm install && npm run build`
