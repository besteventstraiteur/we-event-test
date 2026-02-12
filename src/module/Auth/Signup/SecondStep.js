import Button from "@/components/Button";
import Link from "next/link";
import React, { useState } from "react";

const categoryData = {
  Beauty: ["Hair", "Makeup", "Skincare", "Eyelash", "Brows"],
  Wellness: ["Massage Therapy", "Reflexology", "Reiki"],
  Fitness: ["Yoga", "Cardio", "Strength"],
  Spa: ["Facial", "Steam", "Aromatherapy"],
  Health: ["Nutrition", "Therapy"],
  Grooming: ["Shaving", "Haircut"],
};

function SecondStep() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const handleCategoryChange = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((cat) => cat !== value)
        : [...prev, value]
    );
  };

  const handleSubcategoryChange = (value) => {
    setSelectedSubcategories((prev) =>
      prev.includes(value)
        ? prev.filter((sub) => sub !== value)
        : [...prev, value]
    );
  };

  const removeSubcategory = (value) => {
    setSelectedSubcategories((prev) => prev.filter((sub) => sub !== value));
  };

  return (
    <div className="account h-100">
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-md-6 d-flex flex-column p-4 gap-4">
            <Link href="/">
              <img src="/images/logo.svg" alt="flex alia" />
            </Link>

            <div className="account__left mx-auto align-self-center my-auto">
              <div className="mb-3">
                <a href="signup.html" className="text-color-dark">
                  <i data-feather="arrow-left"></i>
                </a>
              </div>

              <h1 className="text-color-dark text-3xl fw-semibold">
                Select Your Services
              </h1>
              <p>
                Tell us what you offer so we can match you with the right
                customers.
              </p>

              <form className="mt-4">
                <div className="row g-3">
                  {/* Category Selection */}
                  <div className="col-md-12">
                    <label className="d-block mb-2 text-sm text-color-dark fw-medium">
                      Category
                    </label>
                    <div className="dropdown">
                      <button
                        className="custom-dropdown btn btn-outline btn-outline-light justify-content-between dropdown-toggle w-100"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Select Options
                      </button>
                      <ul className="dropdown-menu w-100">
                        {Object.keys(categoryData).map((category) => (
                          <li key={category}>
                            <div className="form-check">
                              <input
                                className="form-check-input checkbox-option"
                                type="checkbox"
                                value={category}
                                id={`cat-${category}`}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`cat-${category}`}
                              >
                                {category}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Subcategory Selection */}
                  <div className="col-md-12">
                    <label className="d-block mb-2 text-sm text-color-dark fw-medium">
                      Subcategory
                    </label>
                    <div className="dropdown">
                      <button
                        className="custom-dropdown btn btn-outline btn-outline-light justify-content-between dropdown-toggle w-100"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Select Options
                      </button>
                      <div className="dropdown-menu w-100 p-3">
                        {selectedCategories.length === 0 ? (
                          <span className="text-muted">
                            Please select at least one category.
                          </span>
                        ) : (
                          selectedCategories.map((cat) => (
                            <div key={cat} className="mb-3">
                              <span className="fw-bold">{cat}</span>
                              <div className="d-flex flex-wrap gap-2 mt-2">
                                {categoryData[cat]?.map((sub) => (
                                  <div key={sub}>
                                    <input
                                      type="checkbox"
                                      id={`sub-${sub}`}
                                      className="d-none"
                                      checked={selectedSubcategories.includes(
                                        sub
                                      )}
                                      onChange={() =>
                                        handleSubcategoryChange(sub)
                                      }
                                    />
                                    <label
                                      className="secondary-bg p-2 rounded text-white"
                                      htmlFor={`sub-${sub}`}
                                    >
                                      <i
                                        data-feather="check"
                                        className="me-1"
                                      />
                                      {sub}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected Subcategories */}
                  <div className="col-md-12">
                    <div className="sub-categories-flex d-flex flex-wrap gap-2 mt-2">
                      {selectedSubcategories.map((sub) => (
                        <div key={sub}>
                          <label className="primary-bg text-white p-2 rounded">
                            {sub}
                            <span
                              className="ms-2 cursor-pointer"
                              onClick={() => removeSubcategory(sub)}
                            >
                              <i data-feather="x" className="text-white">X</i>
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12">
                    <Button
                      className="btn btn-fill-dark w-100"
                      type="button"
                      onClick={() => {
                        // Handle the continue action, e.g., validation or submission
                        console.log("Selected Categories:", selectedCategories);
                        console.log("Selected Subcategories:", selectedSubcategories);
                      }}
                    >
                      Continue
                    </Button>

                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-md-6 h-100 img-box">
            <div className="account-bg position-fixed end-0 top-0 w-50 h-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondStep;
