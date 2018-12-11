function processar(){
	var lines = document.getElementById("chordIn").value.split('\n');
  var newLines = [];
  var numberLines = lines.length;
  for(var i=0; i<numberLines; i++){
		if(!lines[i].trim().startsWith("=")){
			newLines[i] = agregadorLinha(lines[i]);
		} else{
			newLines[i] = lines[i].trim();
		}
  }
	document.getElementById("chordIn").value = lines.join('\n');
	document.getElementById("chordOut").value = newLines.join('\n');
  outHtml(newLines.join('\n'));
}
function agregadorLinha(text){
  var newText = text;
  newText = removerEspacosExtras(newText);
  newText = limparAcordesComCaracteresInvalidos(newText);
  newText = limparCaracteresQualitativosIniciando(newText);
  newText = limparIsQueNaoEmDim(newText);
  newText = limparDisNoInicio(newText);
  newText = limparCaracteres(newText);
  newText = quebrarAcordesJuntos(newText);
  newText = substituirDiminuto(newText);
  newText = insertStartEndBars(newText);
  newText = replaceWhiteSpacesToBars(newText);
  newText = replaceUndescores(newText);
  newText = replaceChords(newText);
  return newText;
}
function agregadorAcorde(text){
	
}
function removerEspacosExtras(text){
  return text.replace(/\ +/gm, " ");
}
function limparAcordesComCaracteresInvalidos(text){
	var acordes = text.split(' ');
  var newAcordes = [];
  var size = acordes.length
  for(var i=0; i<size; i++){
  	if(!/[^\s,a,b,c,d,e,f,g,i,m,j,o,=,\(,\),#,º,0-9,_,\/]/gmi.test(acordes[i])){
    	newAcordes[i] = acordes[i];
    }
  }
  return newAcordes.join(' ');
}
function substituirDiminuto(text){
  return text.replace(/(dim|o)/gmi,"º");
}
function limparCaracteresQualitativosIniciando(text){
	return text.replace(/(\B[#|º]|\b[m|n|o|i|0-9])/gmi, '');
}
function limparIsQueNaoEmDim(text){
	return text.replace(/[^d]i.*?\b/gmi, '');
}
function limparDisNoInicio(text){
	return text.replace(/\bdi.*?\b/gmi, '');
}
function limparCaracteres(text){
  var newText = text;
  newText = newText.replace(/\b.i.+\s/gmi, ' ');
  newText = newText.replace(/om/gmi, '');
  return newText;
}
function quebrarAcordesJuntos(text){
	var newText = text;
  var myRegex1 = /[m0-9#ºa-g][ac-g]/mi;
  while(myRegex1.test(newText)){
  	newText = newText.replace(myRegex1, function(v){return v.split('').join(' ')});
  }
  var myRegex2 = /[a-g]b[a-g]/mi;
  while(myRegex2.test(newText)){
  	newText = newText.replace(myRegex2, function(v){var nv = v.split(''); return nv[0]+nv[1]+' '+nv[2];});
  }
  var myRegex3 = /[A-G][A-G]/;
  while(myRegex3.test(newText)){
  	newText = newText.replace(myRegex3, function(v){return v.split('').join(' ')});
  }
  return newText;
}
function replaceWhiteSpacesToBars(text){
  return text.replace(/\ +/gm, '\u{1D100}');
}
function replaceUndescores(text){
  return text.replace(/_/gm, ' ');
}
function insertStartEndBars(text){
  var textOut = text.trim();
  if(textOut.startsWith("|:")){
    textOut = textOut.replace(/\|:\s|\|:/gm, '\u{1D106}');
  } else if(textOut.startsWith("(")){
    textOut = textOut.replace(/\(\s|\(/gm, '\u{1D106}');
  } else {
    if(textOut.length > 0) {
      textOut = '\u{1D100}' + textOut;
    }
  }
  if(textOut.includes(":|")){
    textOut = textOut.replace(/\s:\||:\|/gm, '\u{1D107}');
  } else if(textOut.includes(")")){
    textOut = textOut.replace(/\s\)|\)/gm, '\u{1D107}');
  } else {
    if(textOut.length > 0) {
      textOut = textOut + '\u{1D100}';
    }
  }
  return textOut;
}
function replaceChords(text){
  var textOut = text;
  textOut = textOut.replace(/\/[a-g]m*/gmi, function(v) { return '/'+v.charAt(1).toUpperCase(); });
  textOut = textOut.replace(/[a-g,º,o](dim|º|o)/gmi, function(v) { return v.charAt(0).toUpperCase()+'º'; });
  textOut = textOut.replace(/[a-g]b/gm, function(v){ return v.charAt(0).toUpperCase()+'b'+'m'});
  textOut = textOut.replace(/[a-g]#/gm, function(v){ return v.charAt(0).toUpperCase()+'#'+'m'});
  textOut = textOut.replace(/[A-G]b/gmi, function(v){ return v.charAt(0)+'b'});
  textOut = textOut.replace(/[A-G]#/gm, function(v){ return v.charAt(0)+'#'});
  textOut = textOut.replace(/[ac-g]/gm, function(v) { return v.toUpperCase()+'m'; });
  textOut = textOut.replace(/𝄀b/gm, '𝄀Bm');
  textOut = textOut.replace(/m+/gmi, 'm');
  textOut = textOut.replace(/j+/gmi, 'j');
  textOut = textOut.replace(/i+/gmi, 'i');
  return textOut;
}
function outHtml(text){
	var lines = text.split('\n');
	var outHtml = '';
	for(var i=0; i<lines.length; i++){
		var outLine = '';
		if(lines[i]){
			if(/^\s*=/.test(lines[i])){
				outLine = diver(per(lines[i].replace(/^\s*=\s*/, '')));
				outHtml += diver(outLine, 'comentario');
			} else{
				outLine = lines[i].replace(/[^𝄀𝄆𝄇]*[^𝄀𝄆𝄇]/gm, function(v){return diver(v, 'acorde divTableCell');});
				outLine = outLine.replace(/[𝄀𝄆𝄇]+/gm, function(v){return diver(v, 'barra divTableCell');});
				outHtml += diver(outLine, 'linha divTableRow');
			}
		}
	}
	document.getElementById('divOutHtml').innerHTML = outHtml;
}
function diver(text, classe){
	if(classe){
  	return '<div class="'+classe+'">'+text+'</div>';
  }
  return '<div>'+text+'</div>';
}
function per(text, classe) {
	if(classe){
  	return '<pre class="'+classe+'">'+text+'</pre>';
  }
  return '<pre>'+text+'</pre>';
}
