# Mirror of My Sites

[![.github/workflows/mirror-sites.yaml](https://github.com/kasparsd/mirror/actions/workflows/mirror-sites.yaml/badge.svg)](https://github.com/kasparsd/mirror/actions/workflows/mirror-sites.yaml)

This repository contains [GitHub actions](.github/workflows) that use the [`mirror.js` script](mirror.js) to create mirrors (copies) of the following sites at [mirror.dambis.id.lv](https://mirror.dambis.id.lv):

- [kaspars.net](https://kaspars.net) at [mirror.dambis.id.lv/kaspars.net](https://mirror.dambis.id.lv/kaspars.net/)
- [kasparsdambis.lv](https://kasparsdambis.lv) at [mirror.dambis.id.lv/kasparsdambis.lv](https://mirror.dambis.id.lv/kasparsdambis.lv/)

## Notes

- We're not using `wget --mirror` because it adjusts the `canonical` meta tags which we probably don't want.

## Credits

Created by [Kaspars Dambis](https://kaspars.net) and licensed under [MIT](LICENSE).
