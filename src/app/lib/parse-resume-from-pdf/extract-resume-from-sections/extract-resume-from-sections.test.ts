import {
  matchOnlyLetterSpaceOrPeriod,
  matchEmail,
  matchPhone,
  matchUrl,
  matchLocation,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-profile";
import type { TextItem } from "lib/parse-resume-from-pdf/types";

const makeTextItem = (text: string) =>
  ({
    text,
  } as TextItem);

describe("extract-profile tests - ", () => {
  it("Name", () => {
    expect(
      matchOnlyLetterSpaceOrPeriod(makeTextItem("Leonardo W. DiCaprio"))![0]
    ).toBe("Leonardo W. DiCaprio");
  });

  it("Email", () => {
    expect(matchEmail(makeTextItem("  hello@open-resume.org  "))![0]).toBe(
      "hello@open-resume.org"
    );
  });

  it("Phone", () => {
    expect(matchPhone(makeTextItem("  (123)456-7890  "))![0]).toBe(
      "(123)456-7890"
    );
    expect(matchPhone(makeTextItem("  +351 912 345 678  "))![0]).toBe(
      "+351 912 345 678"
    );
    expect(matchPhone(makeTextItem("12345"))).toBeFalsy();
  });

  it("Location", () => {
    expect(matchLocation(makeTextItem("Lisbon, PT"))![0]).toBe("Lisbon, PT");
    expect(matchLocation(makeTextItem("Paris, France"))![0]).toBe(
      "Paris, France"
    );
    expect(matchLocation(makeTextItem("Remote"))).toBeFalsy();
  });

  it("Url", () => {
    expect(matchUrl(makeTextItem("  linkedin.com/in/open-resume  "))![0]).toBe(
      "linkedin.com/in/open-resume"
    );
    expect(matchUrl(makeTextItem("hello@open-resume.org"))).toBeFalsy();
  });
});
