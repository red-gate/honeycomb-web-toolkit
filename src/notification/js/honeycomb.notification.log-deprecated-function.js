const logDeprecatedFunctionToConsole = (
    func = '',
    module = '',
    version = '14.2.0'
) => {
    let warning = `"${func}" has been deprecated `;
    if (module !== '') {
        warning += `from the "${module}" module `;
    }
    warning += `in Honeycomb web toolkit v${version} and will be removed in a later version.`;

    window.console.warn(warning);
};

export { logDeprecatedFunctionToConsole };
