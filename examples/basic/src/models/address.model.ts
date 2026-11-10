import { CinCrudModel, CinModel, CinText } from "@metacrud/core";

/**
 * An embedded model: it only describes the fields of a nested object (see
 * `User.address`). It has no pages and no repository of its own, so every
 * page is left out of the options, which disables it.
 */
@CinCrudModel({ name: "Address" })
export class Address extends CinModel {
  @CinText()
  city!: string;

  @CinText()
  street!: string;

  @CinText({ defaultValue: "" })
  postalCode!: string;
}
