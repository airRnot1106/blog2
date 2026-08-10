{
  inputs = {
    agenput-skills.url = "github:airRnot1106/agenput-skills-nix";
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs";

    anthropic-skills = {
      url = "github:anthropics/skills";
      flake = false;
    };
    playwright-cli = {
      url = "github:microsoft/playwright-cli";
      flake = false;
    };
    vercel-labs = {
      url = "github:vercel-labs/agent-skills";
      flake = false;
    };
  };

  outputs =
    {
      self,
      agenput-skills,
      flake-utils,
      nixpkgs,
      ...
    }@inputs:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        skills = [
          {
            name = "composition-patterns";
            src = inputs.vercel-labs;
            subpath = "skills/composition-patterns";
          }
          {
            name = "deploy-to-vercel";
            src = inputs.vercel-labs;
            subpath = "skills/deploy-to-vercel";
          }
          {
            name = "frontend-design";
            src = inputs.anthropic-skills;
            subpath = "skills/frontend-design";
          }
          {
            name = "playwright-cli";
            src = inputs.playwright-cli;
            subpath = "skills/playwright-cli";
          }
          {
            name = "react-best-practices";
            src = inputs.vercel-labs;
            subpath = "skills/react-best-practices";
          }
          {
            name = "react-view-transitions";
            src = inputs.vercel-labs;
            subpath = "skills/react-view-transitions";
          }
          {
            name = "vercel-optimize";
            src = inputs.vercel-labs;
            subpath = "skills/vercel-optimize";
          }
          {
            name = "web-design-guidelines";
            src = inputs.vercel-labs;
            subpath = "skills/web-design-guidelines";
          }
        ];
      in
      {
        nput = {
          skills-claude = agenput-skills.lib.mkSkillsManifest {
            inherit pkgs skills;
            root = agenput-skills.lib.projectRoot;
            prefix = agenput-skills.lib.presets.claude.project;
          };
        };

        devShells.default = pkgs.mkShellNoCC {
          inputsFrom = [
            (agenput-skills.lib.mkSkillsDevShell {
              inherit pkgs;
              names = builtins.attrNames self.nput.${system};
            })
          ];
        };
      }
    );
}
