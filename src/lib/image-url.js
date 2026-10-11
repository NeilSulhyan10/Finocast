export const IMAGE_ASSET_VERSION = "20261011";

export function versionedImagePath(src) {
  return `${src}?v=${IMAGE_ASSET_VERSION}`;
}
