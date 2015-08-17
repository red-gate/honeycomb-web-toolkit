# Honeycomb

## Introduction
Honeycomb is the Web team's approach at providing consistent code, design and components across Redgate's web based projects/products.

Honeycomb is designed to be the core foundation for a web project to be built from. Website developers then build their web project using, and building upon, the building blocks and components that Honeycomb provides.

## Modules
The building blocks and components have been separated into modules, to make it easier to maintain and separate concerns. Each module has a README that explains what the module is for, and the module dependencies it has.

## Bower
Honeycomb is packaged as a Bower package, and therefore can be distributed across projects using the Bower package manager (http://bower.io/, a package manager for the web).

This allows the project to be separated, managed and distributed easily, and allows developers to easily update their projects to the latest, or specific version, of Honeycomb.

### Getting Honeycomb into your project
Firstly, make sure you've installed Bower.

Once Bower is installed, add a bower.json manifest file into the root of your project and add the following json:

<pre><code>{
    "name": "Your project name goes here",
    "version": "Your project version goes here, e.g. 1.0.0",
    "dependencies": {
        "honeycomb": "git@github.com:red-gate/honeycomb.git"
    }
}
</code></pre>

Then, simply run <code>bower install</code>. Bower will grab the latest version of Honeycomb, and you should now see a new directory <code>bower_components</code> in your root directory. This will include the <code>honeycomb</code> directory, where all the Honeycomb code is kept.

Please refer to the Honeycomb instructions (coming soon) to learn how to use Honeycomb in your project.
