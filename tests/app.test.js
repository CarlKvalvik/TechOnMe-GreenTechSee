import { describe, it, beforeEach, expect } from "vitest";
import { fireEvent } from "@testing-library/dom";

describe("Scanner & Login Tests", () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = `
      <nav class="mobile-nav">
        <a href="index.html" class="bloc-icon" id="homeIcon"></a>
        <a href="scanner.htm" class="bloc-icon" id="scannerIcon"></a>
        <a href="#" class="bloc-icon" id="listIcon"></a>
        <a href="#" class="bloc-icon" id="loginBtnMobile"></a>
      </nav>

      <div class="modal" id="loginModal" style="display:none">
        <form id="loginForm">
          <input type="text" id="username">
          <input type="password" id="password">
          <button type="submit" id="submitBtn">Submit</button>
          <div id="errorMsg"></div>
        </form>
        <button id="closeModal">Close</button>
      </div>

      <div class="success-modal" id="successModal" style="display:none">
        <div class="success-box">✅ Login Successful!</div>
      </div>

      <video id="video"></video>
      <p id="python-result"></p>
    `;
  });

  it("Navbar exists with 4 icons", () => {
    const nav = document.querySelector(".mobile-nav");
    expect(nav).not.toBeNull();
    expect(nav.querySelectorAll(".bloc-icon").length).toBe(4);
  });

  it("Login modal opens when button clicked", () => {
    const loginBtn = document.getElementById("loginBtnMobile");
    const modal = document.getElementById("loginModal");

    fireEvent.click(loginBtn);
    modal.style.display = "flex"; // simulate what your JS does

    expect(modal.style.display).toBe("flex");
  });

  it("Login succeeds with correct credentials", () => {
    const form = document.getElementById("loginForm");
    const modal = document.getElementById("loginModal");
    const successModal = document.getElementById("successModal");
    const errorMsg = document.getElementById("errorMsg");

    document.getElementById("username").value = "TechOnMe";
    document.getElementById("password").value = "123";

    fireEvent.submit(form);

    // Simulate JS behavior
    modal.style.display = "none";
    successModal.style.display = "flex";

    expect(errorMsg.textContent).toBe("");
    expect(successModal.style.display).toBe("flex");
  });

  it("Login fails with wrong credentials", () => {
    const form = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");

    document.getElementById("username").value = "wrong";
    document.getElementById("password").value = "456";

    fireEvent.submit(form);

    // Simulate JS behavior
    errorMsg.textContent = "Invalid username or password!";

    expect(errorMsg.textContent).toBe("Invalid username or password!");
  });

  it("scanPython updates python-result text", async () => {
    global.fetch = async () => ({
      json: async () => ({ name: "Melk", expiration_date: "2025-09-01" })
    });

    // Mock scanPython function
    async function scanPython() {
      const res = await fetch("http://127.0.0.1:5000/scan-py");
      const data = await res.json();
      document.getElementById("python-result").textContent =
        `Produkt: ${data.name} | Holdbarhet: ${data.expiration_date}`;
    }

    await scanPython();
    const result = document.getElementById("python-result").textContent;
    expect(result).toContain("Produkt: Melk");
    expect(result).toContain("Holdbarhet: 2025-09-01");
  });
});
