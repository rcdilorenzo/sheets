from setuptools import find_packages, setup

setup(
    name="sheets",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "flask",
    ],
    package_data={
        "sheets": ["data/*"],
    },
)
