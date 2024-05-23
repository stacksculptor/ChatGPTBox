from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Assuming Chrome, but you can use any WebDriver
driver = webdriver.Chrome()

try:
    driver.get("https://verif.tools/en/singapore_passport")

    # Find the element and perform a click
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[@id='app']/div/main/div[2]/div/div/div[3]/div/div/p"))
    ).click()

    # Type into input fields
    driver.find_element(By.ID, "LN").send_keys("Doe")
    driver.find_element(By.ID, "FN").send_keys("john")
    driver.find_element(By.ID, "NUMBER").send_keys("K1234567E")
    driver.find_element(By.ID, "SEX").send_keys("M")
    
    # Click on another element by its XPath
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[@id='app']/div/main/div[2]/div/div/div[3]/div/div[2]/p"))
    ).click()

    # Continue typing into other input fields
    driver.find_element(By.ID, "DOB").send_keys("16.10.1986")
    driver.find_element(By.ID, "DOI").send_keys("15.12.2020")
    driver.find_element(By.ID, "DOE").send_keys("15.12.2025")

    # Perform another click action
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[@id='app']/div/main/div[2]/div/div/div[3]/div/div[5]/p"))
    ).click()

    # And so on, for the remaining steps
    driver.find_element(By.ID, "BACKGROUND").send_keys("Photo")
    driver.find_element(By.ID, "BACKGROUND_NUMBER").send_keys("1")

    # Finally, perform the click to generate
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".text > span"))
    ).click()

finally:
    print("success")
    # Close the browser window and quit the WebDriver instance
    #driver.quit()
