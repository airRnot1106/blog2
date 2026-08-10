{
  self,
  pkgs,
  nur-packages,
}:
let
  inherit (pkgs.lib) getExe;
in
{
  src = self;
  hooks = {
    actionlint.enable = true;
    ghalint = rec {
      enable = true;
      package = pkgs.ghalint;
      entry = "${getExe package} run";
      files = "^\.github/workflows/.*\.(yml|yaml)$";
      pass_filenames = false;
    };
    ghasec = rec {
      enable = true;
      package = nur-packages.packages.${pkgs.stdenv.hostPlatform.system}.ghasec;
      entry = getExe package;
      files = "^\.github/workflows/.*\.(yml|yaml)$";
    };
    gitleaks = rec {
      enable = true;
      package = pkgs.gitleaks;
      entry = "${getExe package} git --pre-commit --redact --staged --verbose";
      pass_filenames = false;
    };
    nixfmt.enable = true;
    pinact = rec {
      enable = true;
      package = pkgs.pinact;
      entry = "${getExe package} run -fix=false -no-api";
      files = "^\.github/workflows/.*\.(yml|yaml)$";
      pass_filenames = false;
    };
    zizmor.enable = true;
  };
}
