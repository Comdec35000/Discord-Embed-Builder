
module.exports.showContext = function (idxStart, idxEnd, line, content) {

    idxStart = idxStart ?? 0;
    idxEnd = idxEnd ?? idxStart;

    let txt = '';
    txt += '\n';
    txt += content[line].join('');
    txt += '\n\n';
    for(let i = 0; i < idxStart-1; i++) txt += ' ';
    for(let i = 0; i <= idxEnd - idxStart; i++) txt += '^';
    txt += '\n';

    return txt;
}