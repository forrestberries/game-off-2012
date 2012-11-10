if( !window.console.clear ) {
	window.console.clear = window.console.log;
}
if( !window.console.group ) {
	window.console.group = window.console.log;
}
if( !window.console.groupEnd ) {
	window.console.groupEnd = window.console.log;
}