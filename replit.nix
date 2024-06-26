{ pkgs }: 
let
	deps = [
		pkgs.nodejs-14_x
		pkgs.nodePackages.typescript-language-server
	];
in pkgs.stdenv.mkDerivation {
	name = "repl";
	buildInputs = deps;
}
