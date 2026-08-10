{
  description = "blog";

  inputs = {
    agent-skills = {
      url = "path:./nix/agent-skills";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
    flake-utils.url = "github:numtide/flake-utils";
    git-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    nur-packages.url = "github:airRnot1106/nur-packages";
  };

  outputs =
    { self, flake-utils, ... }@inputs:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import inputs.nixpkgs {
          inherit system;
        };
        gitHooks = inputs.git-hooks.lib.${system}.run (
          import ./nix/git-hooks.nix {
            inherit self pkgs;
            inherit (inputs) nur-packages;
          }
        );
      in
      {
        devShells.default =
          let
            inherit (gitHooks) shellHook enabledPackages;
          in
          pkgs.mkShellNoCC {
            inherit shellHook;
            inputsFrom = [
              inputs.agent-skills.devShells.${system}.default
            ];
            packages =
              with pkgs;
              [
                nodejs_26
                pnpm_11
                shellcheck
              ]
              ++ enabledPackages;
          };

        formatter =
          let
            config = gitHooks.config;
            inherit (config) package configFile;
            script = ''
              ${pkgs.lib.getExe package} run --all-files --config ${configFile}
            '';
          in
          pkgs.writeShellScriptBin "pre-commit-run" script;

        nput = {
          inherit (inputs.agent-skills.nput.${system}) skills-claude;
        };
      }
    );
}
