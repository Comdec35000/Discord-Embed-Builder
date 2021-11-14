
module.exports.showContext = function (idxStart, idxEnd, content) {

    idxStart = idxStart ?? 0;
    idxEnd = idxEnd ?? idxStart;

    let txt = '';
    txt += '\n';
    txt += content[this.ln].join('');
    txt += '\n';
    for(let i = 0; i < idxStart-1; i++) txt += ' ';
    for(let i = 0; i <= idxEnd - idxStart; i++) txt += '^';

    return txt;
}