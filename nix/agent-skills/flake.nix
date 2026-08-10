{
  inputs = {
    agenput-skills.url = "github:airRnot1106/agenput-skills-nix";
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs";

    anthropic-skills = {
      url = "github:anthropics/skills";
      flake = false;
    };
    markuplint = {
      url = "github:markuplint/markuplint";
      flake = false;
    };
    nextjs = {
      url = "github:vercel/next.js";
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
            name = "markuplint";
            src = inputs.markuplint;
            subpath = "skills/markuplint";
          }
          {
            name = "markuplint-configure";
            src = inputs.markuplint;
            subpath = "skills/markuplint-configure";

          }
          {
            name = "markuplint-setup";
            src = inputs.markuplint;
            subpath = "skills/markuplint-setup";
          }
          {
            name = "next-cache-components-adoption";
            src = inputs.nextjs;
            subpath = "skills/next-cache-components-adoption";
          }
          {
            name = "next-cache-components-optimizer";
            src = inputs.nextjs;
            subpath = "skills/next-cache-components-optimizer";
          }
          {
            name = "next-dev-loop";
            src = inputs.nextjs;
            subpath = "skills/next-dev-loop";
          }
          {
            name = "next-partial-prefetching-adoption";
            src = inputs.nextjs;
            subpath = "skills/next-partial-prefetching-adoption";
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
