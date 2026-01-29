import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeLocaleToggle } from "components/ResumeForm/ResumeLocaleToggle";

describe("ResumeLocaleToggle", () => {
  it("updates locale in store", () => {
    const { getByRole } = render(
      <Provider store={store}>
        <ResumeLocaleToggle />
      </Provider>
    );

    const select = getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "us" } });

    expect(store.getState().settings.resumeLocale).toBe("us");
  });
});
